import { utils } from "@aeroware/aeroclient";
import { Command } from "@aeroware/aeroclient/dist/types";
import { getReply } from "@aeroware/discord-utils/dist/input";
import { Message, User } from "discord.js";
import enemies from "../../models/Enemy";
import users from "../../models/User";
import { addEXP } from "../../utils/leveling";
import { randInt } from "../../utils/random";
import toPower from "../../utils/toPower";

// Wild Kratts reference
const creaturePower: {
    [name: string]: number;
} = {
    imp: 1,
    goblin: 1.1,
    spirit: 1.25,
    gremlin: 1.75,
    ogre: 2.5,
    dragon: 5,
};

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
            if (!Object.keys(creaturePower).includes(args[0])) return message.channel.send("Unrecognized creature.");

            let bonus = 0;

            const enemy = await enemies.create({
                fighting: message.author.id,
                name: args[0],
                health: Math.ceil(creaturePower[args[0]] * 10),
            });

            await fightMob(message.author, enemy, message, bonus);
        }
    },
} as Command;

async function fightMob(user: User, enemy: any, message: Message, bonus: number): Promise<any> {
    const player = await users.findById(user.id);

    const weapons = player.hotbar.filter((i: any) => i.type === "weapon");
    const armor = player.hotbar.filter((i: any) => i.type === "armor");

    let bestWeapon;
    for (const w of weapons) {
        if (!bestWeapon) bestWeapon = w;
        if (toPower[bestWeapon.rarity] < w.rarity) bestWeapon = w;
    }

    if (!bestWeapon) return message.channel.send("You don't have a weapon!");

    let bestArmor;
    for (const a of armor) {
        if (!bestArmor) bestArmor = a;
        if (toPower[bestArmor.rarity] < a.rarity) bestArmor = a;
    }

    if (!bestArmor)
        bestArmor = {
            base: 0,
            rarity: "common",
        };

    await message.channel.send("What's your move (`attack`, `defend`, `heal`, `surrender`)?");

    const reply = await getReply(message, {
        time: 30000,
        user: message.author,
        keywords: ["attack", "defend", "heal", "surrender"],
    });

    let moveMsg: Message;

    const power = Math.floor(bestWeapon.base * toPower[bestWeapon.rarity] * (1 - bestArmor.base));
    const dmg = Math.floor(5 / power + creaturePower[enemy.name] * 10);
    const toLose = Math.floor(player.coins * 0.2);

    if (reply) {
        switch (reply.content) {
            case "attack":
                enemy.health -= power;
                await message.channel.send(`You did ${power} damage to **${enemy.name}**. **${enemy.name}** has ${enemy.health} health.`);
                if (enemy.health <= 0) {
                    const exp = creaturePower[enemy.name] * 20 + bonus;
                    await message.channel.send(`You killed **${enemy.name}**. You gained ${exp} exp.`);
                    await addEXP(message.author, exp);
                    return await enemy.delete();
                }
                break;

            case "defend":
                bonus += 20;
                //todo: decrease incoming damage from enemy
                break;

            case "heal":
                bonus += 10;
                player.health += 10;
                if (player.health > 100) player.health = 100;
                await message.channel.send(`You healed 10 health. You have ${player.health} health.`);
                break;

            case "surrender":
                return message.channel.send("You quit the battle but you live to fight another day!");

            default:
                break;
        }
        await enemy.save();
        await player.save();
        if (player.health <= 0) return killPlayer(player, message, toLose);
        await enemyMove(enemy, player, message, moveMsg!, dmg);
    } else {
        message.channel.send("You didn't respond. What a wimp.");
        return await enemy.delete();
    }

    return await fightMob(user, enemy, message, bonus);
}

async function enemyMove(enemy: any, player: any, message: Message, moveMsg: Message, dmg: number) {
    moveMsg = await message.channel.send(`**${enemy.name}** is making their move...`);
    player.health -= dmg;
    await utils.aDelayOf(randInt(1000, 1250));
    await moveMsg.edit(`**${enemy.name}** did ${dmg} damage to you. You have ${player.health} health.`);
}

async function killPlayer(player: any, message: Message, toLose: number) {
    const randomItem = player.hotbar[Math.floor(Math.random() * player.hotbar.length)];
    await users.findByIdAndUpdate(message.author.id, {
        $pull: {
            hotbar: randomItem,
        },
        $inc: {
            coins: -Math.floor(player.coins * 0.2),
        },
    });
    player.health = 100;
    return message.channel.send(
        `You died. You lost ${toLose} coin${toLose !== 1 ? "s" : ""} and a${
            randomItem.rarity.startsWith("e") || randomItem.rarity.startsWith("u") ? "n" : ""
        } ${randomItem.rarity} ${randomItem.name}.`
    );
}
