import { Command } from "@aeroware/aeroclient/dist/types";
import { MessageEmbed } from "discord.js";
import items from "../../models/Item";
import toEmoji from "../../utils/toEmoji";
import toRank from "../../utils/toRank";

export default {
    name: "items",
    async callback({ message }) {
        const all = ((await items.find()) as { rarity: string; name: string; description: string }[])
            .sort((a, b) => toRank[a.rarity] - toRank[b.rarity])
            .map((item) => ({
                name: `${toEmoji[item.rarity]} ${item.rarity} ${item.name}`,
                value: item.description,
                inline: true,
            }));

        message.channel.send(new MessageEmbed().addFields(all));
    },
} as Command;
