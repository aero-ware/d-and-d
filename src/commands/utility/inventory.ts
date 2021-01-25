import { Command } from "@aeroware/aeroclient/dist/types";
import utils from "@aeroware/discord-utils";
import { MessageEmbed } from "discord.js";
import users from "../../models/User";
import toEmoji from "../../utils/toEmoji";
import toRank from "../../utils/toRank";

export default {
    name: "inventory",
    aliases: ["inv"],
    category: "utility",
    description: "Check your inventory!",
    cooldown: 5,
    details: "Displays a pagination so you can inspect your items.",
    async callback({ message }) {
        const user = await users.findOne({
            id: message.author.id,
        });

        if (!user.inventory.length) return message.channel.send("You don't have any items!");

        const itemsPerPage = 6;
        const color = "#" + Math.floor(Math.random() * 16777215).toString(16);

        const all = (user.inventory as { rarity: string; name: string; description: string }[])
            .sort((a, b) => (a.name === b.name ? toRank[a.rarity] - toRank[b.rarity] : 1))
            .map((item) => ({
                name: `${toEmoji[item.rarity]} ${item.rarity} ${item.name}`,
                value: item.description,
                inline: true,
            }));

        const fields = all
            .map((_, i) => (i % itemsPerPage ? undefined : all.slice(i, Math.floor(i / itemsPerPage) * itemsPerPage + itemsPerPage)))
            .filter(($) => !!$);

        const pages = fields.map((field) => new MessageEmbed().setColor(color).addFields(field!));

        return utils.paginate(message, pages, {
            time: 60000,
            fastForwardAndRewind: {
                time: 10000,
            },
            goTo: {
                time: 10000,
            },
        });
    },
} as Command;
