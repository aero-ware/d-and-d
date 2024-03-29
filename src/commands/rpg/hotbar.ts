import { Command } from "@aeroware/aeroclient/dist/types";
import { getReply } from "@aeroware/discord-utils/dist/input";
import { rarities } from "../../models/Item";
import users from "../../models/User";
import Embed from "../../utils/embed";
import toEmoji from "../../utils/toEmoji";
import toRank from "../../utils/toRank";

export default {
    name: "hotbar",
    aliases: ["hb", "active"],
    args: false,
    usage: "[switch|remove|add|clear]",
    category: "rpg",
    description: "Check your hotbar!",
    cooldown: 2,
    details: "Displays your hotbar.",
    async callback({ message, args }) {
        const user = await users.findOne({
            _id: message.author.id,
        });

        if (args[0]) {
            switch (args[0]) {
                case "remove":
                    if (!user.hotbar.length) return message.channel.send("You don't have any active items!");
                    message.channel.send("What do you want to remove?");
                    const item = (
                        await getReply(message, {
                            time: 15000,
                        })
                    )?.content
                        .split(" ")
                        .slice(0, 2);
                    if (!item) return;
                    if (!rarities.includes(item[0])) {
                        message.channel.send("That's not a rarity.");
                        return "invalid";
                    }
                    const hotbar = user.hotbar.find((i: any) => i.rarity === item[0] && i.name === item[1]);
                    if (!hotbar) {
                        message.channel.send("That's not an active item.");
                        return "invalid";
                    }
                    const index = user.hotbar.indexOf(hotbar);
                    user.hotbar.splice(index, 1);
                    user.inventory.push(hotbar);
                    await user.save();
                    return message.channel.send(
                        `Removed a${item[0].startsWith("e") || item[0].startsWith("u") ? "n" : ""} ${item[0]} ${item[1]} from your hotbar!`
                    );
                case "add":
                    if (user.hotbar.length >= 6) return message.channel.send("Your hotbar is full!");
                    message.channel.send("What do you want to add?");
                    const itemToAdd = (
                        await getReply(message, {
                            time: 15000,
                        })
                    )?.content
                        .split(" ")
                        .slice(0, 2);
                    if (!itemToAdd) return;
                    if (!rarities.includes(itemToAdd[0])) {
                        message.channel.send("That's not a rarity.");
                        return "invalid";
                    }
                    const inv = user.inventory.find((i: any) => i.rarity === itemToAdd[0] && i.name === itemToAdd[1]);
                    if (!inv) {
                        message.channel.send("You don't have that item!");
                        return "invalid";
                    }
                    const idx = user.inventory.indexOf(inv);
                    user.inventory.splice(idx, 1);
                    user.hotbar.push(inv);
                    await user.save();
                    return message.channel.send(
                        `Added a${itemToAdd[0].startsWith("e") || itemToAdd[0].startsWith("u") ? "n" : ""} ${itemToAdd[0]} ${itemToAdd[1]} to your hotbar!`
                    );
                case "switch":
                    message.channel.send("What do you want to switch out?");
                    const toRem = (
                        await getReply(message, {
                            time: 10000,
                        })
                    )?.content
                        ?.split(" ")
                        .slice(0, 2);
                    if (!toRem) return;
                    if (!rarities.includes(toRem[0])) {
                        message.channel.send("That's not a rarity.");
                        return "invalid";
                    }
                    const toRemItem = user.hotbar.find((i: any) => i.rarity === toRem[0] && i.name === toRem[1]);
                    if (!toRemItem) {
                        message.channel.send("That item isn't in your hotbar!");
                        return "invalid";
                    }
                    message.channel.send("What do you want to replace it with?");
                    const toAdd = (
                        await getReply(message, {
                            time: 10000,
                        })
                    )?.content
                        ?.split(" ")
                        .slice(0, 2);
                    if (!toAdd) return;
                    if (!rarities.includes(toRem[0])) {
                        message.channel.send("That's not a rarity.");
                        return "invalid";
                    }
                    const toAddItem = user.inventory.find((i: any) => i.rarity === toAdd[0] && i.name === toAdd[1]);
                    if (!toAddItem) {
                        message.channel.send("That item isn't in your inventory!");
                        return "invalid";
                    }
                    const addI = user.inventory.indexOf(toAddItem);
                    const remI = user.hotbar.indexOf(toRemItem);
                    user.hotbar.push(toAddItem);
                    user.hotbar.splice(remI, 1);
                    user.inventory.push(toRemItem);
                    user.hotbar.splice(addI, 1);
                    await user.save();
                    return message.channel.send(
                        `Switched out a${toRem[0].startsWith("e") || toRem[0].startsWith("u") ? "n" : ""} ${toRem[0]} ${toRem[1]} for a${
                            toAdd[0].startsWith("e") || toAdd[0].startsWith("u") ? "n" : ""
                        } ${toAdd[0]} ${toAdd[1]}!`
                    );
                case "clear":
                    user.inventory.push(...user.hotbar);
                    user.hotbar = [];
                    await user.save();
                    return message.channel.send("Your hotbar has been cleared!");
                default:
                    const mention = message.mentions.users.first();
                    if (mention) {
                        const target = await users.findOne({
                            _id: mention?.id,
                        });
                        if (!target) {
                            message.channel.send(`I've never heard of someone named ${mention?.id}.`);
                            return "invalid";
                        }
                        if (!target.hotbar.length) return message.channel.send("They don't have any active items!");
                        const all = (target.hotbar as { rarity: string; name: string; description: string }[])
                            .sort((a, b) => (a.name === b.name ? toRank[a.rarity] - toRank[b.rarity] : 1))
                            .map((item) => ({
                                name: `${toEmoji[item.rarity]} ${item.rarity} ${item.name}`,
                                value: item.description,
                                inline: true,
                            }));
                        return message.channel.send(
                            new Embed()
                                .setColor("RANDOM")
                                .addFields(all)
                                .setTitle(`${mention.username}'s hotbar`)
                                .setDescription("This is the stuff they have in their hotbar.")
                        );
                    }
            }
        }

        if (!user.hotbar.length) return message.channel.send("You don't have any active items!");

        const all = (user.hotbar as { rarity: string; name: string; description: string }[])
            .sort((a, b) => (a.name === b.name ? toRank[a.rarity] - toRank[b.rarity] : 1))
            .map((item) => ({
                name: `${toEmoji[item.rarity]} ${item.rarity} ${item.name}`,
                value: item.description,
                inline: true,
            }));

        return message.channel.send(
            new Embed()
                .setColor("RANDOM")
                .addFields(all)
                .setTitle(`${message.author.username}'s hotbar`)
                .setDescription("This is the stuff you have that is in your hotbar.")
        );
    },
} as Command;
