import { Command } from "@aeroware/aeroclient/dist/types";
import utils from "@aeroware/discord-utils";
import { Message } from "discord.js";
import items from "../../models/Item";
import users from "../../models/User";

export default {
    name: "start",
    aliases: ["join", "restart"],
    category: "rpg",
    cooldown: 3600,
    description: "Join the game!",
    details: "Use this command to join the game, or restart your progress.",
    async callback({ message }) {
        const user = await users.findOne({
            _id: message.author.id,
        });

        if (!user) {
            return chooseClass(message);
        } else {
            let prestige = false;

            if (user.level >= 100 && user.strength >= 100 && user.speed >= 100 && user.intelligence >= 100 && user.speed >= 100 && user.didWin) prestige = true;

            const r = await message.channel.send(`Are you sure you want to reset your progress${prestige ? " and prestige" : ""}?`);
            await r.react("❌");
            await r.react("✅");

            const choice = (
                await r.awaitReactions((re, usr) => usr.id === message.author.id && ["❌", "✅"].includes(re.emoji.name), {
                    max: 1,
                    time: 10000,
                })
            ).first();

            if (!choice) return "invalid";

            if (choice.emoji.name === "✅") {
                if (prestige) user.prestige++;
                user.hotbar = [];
                user.inventory = [];
                user.skillPoints = 0;
                user.location = "start";
                user.level = 0;
                user.exp = 0;
                user.health = 100;
                await user.save();

                return chooseClass(message);
            }

            return message.channel.send("Canceled reset!");
        }
    },
} as Command;

async function chooseClass(message: Message) {
    await message.channel.send("What class do you want to be? (`warrior`, `archer`, `mage`, `tank`)");
    const choice = await utils.getReply(message, {
        keywords: ["warrior", "archer", "mage", "tank"],
        time: 10000,
    });

    if (!choice) return "invalid";

    const newUser =
        (await users.findOne({
            _id: message.author.id,
        })) ||
        (await users.create({
            _id: message.author.id,
        }));

    switch (choice.content) {
        case "warrior":
            //@ts-ignore
            newUser.hotbar.push(
                ...(await Promise.all([
                    items.findOne({
                        name: "sword",
                        rarity: "common",
                    }),
                    items.findOne({
                        name: "shield",
                        rarity: "common",
                    }),
                    items.findOne({
                        name: "chestplate",
                        rarity: "common",
                    }),
                ]))
            );
            //@ts-ignore
            newUser.intelligence = 5;
            //@ts-ignore
            newUser.speed = 5;
            //@ts-ignore
            newUser.mana = 3;
            //@ts-ignore
            newUser.strength = 10;
            break;
        case "archer":
            //@ts-ignore
            newUser.hotbar.push(
                ...(await Promise.all([
                    items.findOne({
                        name: "tunic",
                        rarity: "common",
                    }),
                    items.findOne({
                        name: "bow",
                        rarity: "common",
                    }),
                    items.findOne({
                        name: "quiver",
                        rarity: "common",
                    }),
                ]))
            );
            //@ts-ignore
            newUser.intelligence = 6;
            //@ts-ignore
            newUser.speed = 7;
            //@ts-ignore
            newUser.mana = 4;
            //@ts-ignore
            newUser.strength = 6;
            break;
        case "tank":
            //@ts-ignore
            newUser.hotbar.push(
                ...(await Promise.all([
                    items.findOne({
                        name: "axe",
                        rarity: "common",
                    }),
                    items.findOne({
                        name: "helmet",
                        rarity: "common",
                    }),
                    items.findOne({
                        name: "chestplate",
                        rarity: "common",
                    }),
                ]))
            );
            //@ts-ignore
            newUser.intelligence = 4;
            //@ts-ignore
            newUser.speed = 3;
            //@ts-ignore
            newUser.mana = 2;
            //@ts-ignore
            newUser.strength = 14;
            break;
        case "mage":
            //@ts-ignore
            newUser.hotbar.push(
                ...(await Promise.all([
                    items.findOne({
                        name: "wand",
                        rarity: "common",
                    }),
                    items.findOne({
                        name: "cloak",
                        rarity: "common",
                    }),
                    items.findOne({
                        name: "tunic",
                        rarity: "common",
                    }),
                ]))
            );
            //@ts-ignore
            newUser.intelligence = 8;
            //@ts-ignore
            newUser.speed = 3;
            //@ts-ignore
            newUser.mana = 7;
            //@ts-ignore
            newUser.strength = 5;
            break;
        default:
            message.channel.send("That wasn't a valid class. Try again!");
            return "invalid";
    }

    //@ts-ignore
    newUser.inventory.push(
        await items.findOne({
            name: "crystal",
            rarity: "uncommon",
        })
    );
    //@ts-ignore
    newUser.balance = 50;

    await newUser.save();

    return message.channel.send(`You are now playing as a \`${choice.content}\`!`);
}
