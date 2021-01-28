import { utils } from "@aeroware/aeroclient";
import { Command } from "@aeroware/aeroclient/dist/types";
import { getReply } from "@aeroware/discord-utils/dist/input";
import { Message } from "discord.js";
import enemies from "../../models/Enemy";
import { rarities } from "../../models/Item";
import users from "../../models/User";
import { addEXP } from "../../utils/leveling";
import { randInt } from "../../utils/random";
import toPower from "../../utils/toPower";

const creaturePower: {
    [name: string]: number;
} = {
    imp: 1.25,
    goblin: 1.65,
    spirit: 2.25,
    gremlin: 2.9,
    ogre: 4,
    dragon: 8,
};

export default {
    name: "fight",
    aliases: ["duel", "attack"],
    category: "rpg",
    args: true,
    usage: "<user|creature>",
    description: "Fight other creatures or players!",
    details: "Turn based fighting!",
    cooldown: 300,
    async callback({ message, args }): Promise<any> {
        if (message.mentions.users.first()) {
            // todo: fight users
            return;
        } else {
            if (!Object.keys(creaturePower).includes(args[0])) return message.channel.send("Unrecognized creature.");

            const player = await users.findById(message.author.id);

            let bonus = 0;

            let healthBonus = Math.round(player.hotbar.reduce((acc: number, cur: any) => acc + toPower[cur.rarity], 0)) * 3;

            const enemy = await enemies.create({
                fighting: message.author.id,
                name: args[0],
                health: Math.round(creaturePower[args[0]] * 10 + Math.random() * 4) + healthBonus,
            });

            await fightMob(player, enemy, message, bonus, false, 0);
            await enemy.delete();
        }
    },
} as Command;

async function fightMob(player: any, enemy: any, message: Message, bonus: number, mobDidDefend: boolean, turn: number): Promise<any> {
    const weapons = player.hotbar.filter((i: any) => i.type === "weapon");
    const armor = player.hotbar
        .filter((i: any) => i.type === "armor")
        .reduce((acc: any[], cur: any) => (acc.find((a) => a.name === cur.name && a.rarity === cur.rarity) ? undefined : (acc = acc.concat([cur]))), []);

    if (!weapons.length) return message.channel.send("You don't have a weapon!");

    let defaultWeapon = weapons[0];

    let armorBonus = 0;

    for (const a of armor) {
        armorBonus += a.base * toPower[a.rarity];
        armorBonus *= 0.99;
    }

    armorBonus = parseFloat(armorBonus.toFixed(2));

    await message.channel.send("What's your move (`attack`, `defend`, `heal`, `surrender`)?");

    const reply = await getReply(message, {
        time: 30000,
        user: message.author,
        keywords: ["attack", "defend", "heal", "surrender"],
    });

    let moveMsg: Message;

    const toLose = Math.floor(player.coins * 0.2);

    let mobDefended = false;

    if (reply) {
        let didDefend = false;
        switch (reply.content) {
            case "attack":
                if (weapons.length >= 2) {
                    message.channel.send("Since you have multiple weapons, which one do you want to use?");
                    let itemName = (
                        await getReply(message, {
                            time: 15000,
                        })
                    )?.content
                        .split(/\s+/g)
                        .slice(0, 2)!;
                    do {
                        if (itemName && itemName.length) {
                            const weapon = player.hotbar.find(
                                (item: any) => item.rarity === itemName[0].toLowerCase() && item.name === itemName[1].toLowerCase()
                            );
                            if (!weapon) {
                                if (rarities.includes(itemName[0])) await message.channel.send("I couldn't find that weapon. Try again.");
                                itemName = (
                                    await getReply(message, {
                                        time: 15000,
                                    })
                                )?.content
                                    .split(/\s+/g)
                                    .slice(0, 2)!;
                            }
                        } else return message.channel.send("Ending fight...");
                    } while (
                        !itemName.length &&
                        !player.hotbar.find((item: any) => item.rarity === itemName[0].toLowerCase() && item.name === itemName[1].toLowerCase())
                    );
                    defaultWeapon = player.hotbar.find((item: any) => item.rarity === itemName[0].toLowerCase() && item.name === itemName[1].toLowerCase());
                    if (!defaultWeapon) return message.channel.send("Ending fight...");
                }
                let power = Math.round(defaultWeapon.base * toPower[defaultWeapon.rarity] + Math.random() * (1 + player.prestige));
                if (mobDidDefend) {
                    power *= 0.5;
                    power = Math.round(power);
                }

                const seed = Math.random();

                switch (defaultWeapon.name) {
                    case "sword":
                        if (seed < 0.2) power *= 2;
                        message.channel.send(`Critical hit! Double damage!`);
                        break;
                    case "bow":
                        if (seed < 0.2) power = 0;
                        message.channel.send(`You missed with your bow.`);
                        break;
                    case "wand":
                        if (seed < 0.2) {
                            power *= 2;
                            message.channel.send(`Your wand surges with power and doubles your damage.`);
                        } else if (seed < 0.5) {
                            power += 10;
                            message.channel.send(`Your wand surges with power and boosts your damage.`);
                        } else if (seed < 0.6) {
                            power = Math.floor(power / 2);
                            message.channel.send(`Your concentration wasn't enough and your wand does half as muc damage.`);
                        }
                        break;
                    case "spear":
                        if (seed < 0.5) power = 0;
                        message.channel.send(`You missed with your spear.`);
                        break;
                    case "dagger":
                        power += turn / 2 + Math.random();
                        power = Math.round(power);
                        break;
                }

                const tools = player.hotbar.filter((item: any) => item.type === "tool");

                tools.forEach((tool: any) => {
                    if (tool.name === "sharpener" && ["sword", "axe", "dagger", "spear"].includes(defaultWeapon.name)) {
                        power *= (1 + tool.base) * toPower[tool.rarity];
                        power = Math.round(power);
                    } else if (tool.name === "quiver" && defaultWeapon.name === "bow") {
                        power *= (1 + tool.base) * toPower[tool.rarity];
                        power = Math.round(power);
                    } else if (tool.name === "magnet") {
                        bonus++;
                        player.balance++;
                    }
                });

                enemy.health -= power;

                await message.channel.send(
                    `You did ${power} damage to **${enemy.name}**. **${enemy.name}** has ${enemy.health < 0 ? 0 : enemy.health} health.`
                );
                if (enemy.health <= 0) {
                    const exp = Math.floor(creaturePower[enemy.name] * 20 + Math.random() * 4 + bonus);
                    await message.channel.send(`You ${Math.random() < 0.5 ? "killed" : "slayed"} **${enemy.name}** and gained ${exp} exp!`);
                    await addEXP(message.author, exp);
                    return await enemy.delete();
                }
                break;

            case "defend":
                bonus += 20;
                player.health += 5;
                didDefend = true;
                await message.channel.send("You take a defensive stance and prepare for the enemy's attack!");
                break;

            case "heal":
                bonus += 10;
                player.health += 20;
                if (player.health > 100) player.health = 100;
                await message.channel.send(`You healed 20 health. You have ${player.health} health.`);
                break;

            case "surrender":
                return message.channel.send("You quit the battle but you live to fight another day!");

            default:
                break;
        }
        await enemy.save();
        await player.save();
        if (player.health <= 0) return killPlayer(player, message, toLose);
        mobDefended = await enemyMove(enemy, player, message, moveMsg!, reply.content, armorBonus, didDefend);
    } else {
        return message.channel.send("You ran away and didn't gain anything.");
    }

    return await fightMob(player, enemy, message, bonus, mobDefended, turn + 1);
}

async function enemyMove(enemy: any, player: any, message: Message, moveMsg: Message, move: string, armor: number, defended: boolean) {
    moveMsg = await message.channel.send(`**${enemy.name}** is making their move...`);

    let isDefending = false;
    const maxHealth = Math.ceil(creaturePower[enemy.name] * 10) + 5;

    await utils.aDelayOf(randInt(1000, 1250));
    const seed = Math.random();

    switch (move) {
        case "attack":
            if (seed < 0.4) await attack();
            else if (seed < 0.9) await defend();
            else if (enemy.health < maxHealth) await heal();
            else await attack();
            break;
        case "defend":
            if (seed < 0.3) await attack();
            else if (seed < 0.7) await defend();
            else if (enemy.health < maxHealth) await heal();
            else await attack();
            break;
        case "heal":
            if (seed < 0.3) await attack();
            else if (seed < 0.5) await defend();
            else if (enemy.health < maxHealth) await heal();
            else await defend();
            break;
    }

    async function attack() {
        let damageBonus = Math.round(player.hotbar.reduce((acc: number, cur: any) => acc + toPower[cur.rarity], 0));
        let dmg =
            Math.round((creaturePower[enemy.name] * 10 + Math.random() * 4 + player.level / 5) * (1 - armor)) + Math.floor(Math.random() * 4) + damageBonus;
        if (defended && player.hotbar.find((i: any) => i.name === "shield")) {
            const shield = player.hotbar.filter((i: any) => i.name === "shield").sort((a: any, b: any) => toPower[b.rarity] - toPower[a.rarity])[0];
            dmg *= 1 - shield.base * toPower[shield.rarity];
            dmg = Math.round(dmg);
        }
        player.health -= dmg;
        await moveMsg.edit(`**${enemy.name}** did ${dmg} damage to you. You have ${player.health} health.`);
    }

    async function defend() {
        enemy.health += 10;
        isDefending = true;
        await moveMsg.edit(`**${enemy.name}** takes cover to defend from your next blow!`);
    }

    async function heal() {
        enemy.health += Math.floor(20 + Math.random() * 4);
        if (enemy.health > maxHealth) enemy.health = maxHealth;
        await moveMsg.edit(`**${enemy.name}** takes a break and heals.`);
    }

    await player.save();
    await enemy.save();

    return isDefending;
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
    await player.save();
    return message.channel.send(
        `You died. You lost ${toLose} coin${toLose !== 1 ? "s" : ""} and a${
            randomItem.rarity.startsWith("e") || randomItem.rarity.startsWith("u") ? "n" : ""
        } ${randomItem.rarity} ${randomItem.name}.`
    );
}
