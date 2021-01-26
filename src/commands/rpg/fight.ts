import { utils } from "@aeroware/aeroclient";
import { Command } from "@aeroware/aeroclient/dist/types";
import { getReply } from "@aeroware/discord-utils/dist/input";
import { Message, User } from "discord.js";
import enemies from "../../models/Enemy";
import users from "../../models/User";
import { addEXP } from "../../utils/leveling";
import toEmoji from "../../utils/toEmoji";
import toPower from "../../utils/toPower";

export default {
    name: "fight",
    aliases: ["duel", "attack"],
    category: "rpg",
    args: true,
    minArgs: 1,
    usage: "<user|creature>",
    async callback({ message, args }): Promise<any> {
        if (message.mentions.users.first()) {
            // todo: fight users
            return;
        } else {
            const mob = args[0];
            if (!/(dragon)|(ogre)|(gremlin)|(imp)|(spirit)|(goblin)/.test(mob)) return message.channel.send("Unrecognized creature.");

            const enemy = await enemies.create({
                fighting: message.author.id,
                name: mob,
            });

            await fightMob(message.author, enemy, message);
        }
    },
} as Command;

async function fightMob(user: User, enemy: any, message: Message): Promise<any> {
    const player = await users.findById(user.id);
    const { inventory } = player;

    const weapons = inventory.filter((i: any) => i.type === "weapon");
    const armor = inventory.filter((i: any) => i.type === "armor");

    let bestWeapon;
    for (const w of weapons) {
        if (!bestWeapon) bestWeapon = w;
        if (toPower[bestWeapon.rarity] < w.rarity) bestWeapon = w;
    }

    let bestArmor;
    for (const a of armor) {
        if (!bestArmor) bestArmor = a;
        if (toPower[bestArmor.rarty] < a.rarity) bestArmor = a;
    }

    const power =
        bestWeapon.base * toPower[bestWeapon.rarity] * (1 - bestArmor.base) > 0 ? bestWeapon.base * toPower[bestWeapon.rarity] * (1 - bestArmor.base) : 3; // current equation to calculate damage

    await message.channel.send("Do you want to attack, defend, or heal?");

    const reply = await getReply(message, {
        time: 30000,
        user: message.author,
    });

    let moveMsg: Message;

    if (reply)
        switch (reply.content) {
            case "attack":
                enemy.health -= power;
                await enemy.save();
                message.channel.send(`You did ${power} damage to ${enemy.name}. ${enemy.name} has ${enemy.health} health`);
                if (enemy.health <= 0) {
                    message.channel.send(`You killed ${enemy.name}. You gained 20 EXP.`);
                    await addEXP(message.author, 20);
                    return await enemy.delete();
                }
                moveMsg = await message.channel.send(`${enemy.name} is making their move...`);
                player.health -= Math.floor(3 / power);
                await player.save();
                await utils.aDelayOf(1150);
                moveMsg.edit(`${enemy.name} did ${Math.floor(3 / power)} damage to you. You have ${player.health} health.`);
                if (player.health <= 0) {
                    const randomItem = inventory[Math.floor(Math.random() * inventory.length)];
                    message.channel.send(
                        `You died. You lost ${player.coins / 5} coins and a ${toEmoji[randomItem.rarity]} ${randomItem.rarity} ${randomItem.name}`
                    );
                    await users.findByIdAndUpdate(message.author.id, {
                        $pull: {
                            hotbar: randomItem,
                        },
                        $inc: {
                            coins: -(player.coins / 5),
                        },
                    });
                }
                break;

            case "defend":
                moveMsg = await message.channel.send(`${enemy.name} is making their move...`);
                player.health -= Math.floor(15);
                await player.save();
                await utils.aDelayOf(1150);
                message.channel.send(`${enemy.name} did ${Math.floor(3 / power)} damage to you. You have ${player.health} health.`);
                if (player.health <= 0) {
                    const randomItem = inventory[Math.floor(Math.random() * inventory.length)];
                    message.channel.send(
                        `You died. You lost ${player.coins / 5} coins and a ${toEmoji[randomItem.rarity]} ${randomItem.rarity} ${randomItem.name}`
                    );
                    player.coins *= 0 / 8;
                    player.inventory = player.inventory.filter((i: any) => i !== randomItem);
                    await player.save();
                }
                break;

            case "heal":
                player.health += 2;
                await player.save();
                message.channel.send(`You healed 2 health. You have ${player.health} health.`);
                break;

            default:
                break;
        }
    else {
        message.channel.send("You didn't respond. What a wimp.");
        return await enemy.delete();
    }

    return fightMob(user, enemy, message);
}
