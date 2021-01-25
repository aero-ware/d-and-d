import { Command } from "@aeroware/aeroclient/dist/types";
import utils from "@aeroware/discord-utils";
import items from "../../models/Item";
import users from "../../models/User";

export default {
    name: "start",
    aliases: ["join", "restart"],
    category: "rpg",
    description: "Join the game!",
    cooldown: 3600,
    details: "Use this command to join the game, or restart your progress.",
    async callback({ message, client, args, text, locale }) {
        const user = await users.findOne({
            id: message.author.id,
        });

        if (!user) {
            await message.channel.send("What class do you want to be? (`warrior`, `archer`, `mage`, `tank`)");
            const choice = await utils.getReply(message, {
                keywords: ["warrior", "archer", "mage", "tank"],
                time: 10000,
            });

            if (!choice) return "invalid";

            const newUser = await users.create({
                id: message.author.id,
            });

            switch (choice.content) {
                case "warrior":
                    //@ts-ignore
                    newUser.inventory.push(
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
                    newUser.inventory.push(
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
                    newUser.intelligence = 7;
                    //@ts-ignore
                    newUser.speed = 7;
                    //@ts-ignore
                    newUser.mana = 4;
                    //@ts-ignore
                    newUser.strength = 7;
                    break;
                case "tank":
                    //@ts-ignore
                    newUser.inventory.push(
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
                    newUser.inventory.push(
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
                    newUser.intelligence = 11;
                    //@ts-ignore
                    newUser.speed = 4;
                    //@ts-ignore
                    newUser.mana = 7;
                    //@ts-ignore
                    newUser.strength = 6;
                    break;
                default:
                    message.channel.send("That wasn't a valid class. Try again!");
                    return "invalid";
            }

            await newUser.save();

            await message.channel.send(`You are now playing as a \`${choice.content}\`!`);
        } else {
            const r = await message.channel.send("Are you sure you want to reset your progress?");
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
                await users.deleteOne({
                    id: message.author.id,
                });

                return client.commands.get("start")?.callback({
                    message,
                    args,
                    client,
                    text,
                    locale,
                });
            }

            return message.channel.send("Canceled reset!");
        }
    },
} as Command;
