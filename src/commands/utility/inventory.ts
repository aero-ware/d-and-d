import { Command } from "@aeroware/aeroclient/dist/types";
import utils from "@aeroware/discord-utils";
import { MessageEmbed } from "discord.js";
import users from "../../models/User";
import toColor from "../../utils/toColor";
import toEmoji from "../../utils/toEmoji";
import toRank from "../../utils/toRank";

export default {
    name: "inventory",
    aliases: ["inv"],
    args: false,
    usage: "[item]",
    category: "utility",
    description: "Check your inventory!",
    cooldown: 2,
    details: "Displays a pagination so you can inspect your items.",
    async callback({ message, args }) {
        const user = await users.findOne({
            _id: message.author.id,
        });

        if (!user.inventory.length) return message.channel.send("You don't have any items in your inventory!");

        const itemsPerPage = 6;
        const color = "#" + Math.floor(Math.random() * 16777215).toString(16);

        let items = user.inventory;

        if (args.length) {
            if (args.join(" ").length < 2) return message.channel.send("Your search query must be at least two characters!");

            const regex = new RegExp(args.join(" ").replace(/[^a-zA-Z0-9 -]/g, ""), "i");

            items = user.inventory.filter((item: any) => regex.test(item.name) || regex.test(item.rarity) || regex.test(`${item.rarity} ${item.name}`));

            if (!items.length) return message.channel.send(`No items found!`);

            const set = new Set(items);

            if (set.size === 1) {
                const item = items[0];
                return message.channel.send(
                    new MessageEmbed()
                        .setTitle(item.name)
                        .setColor(toColor[item.rarity])
                        .setDescription(item.description)
                        .addField("Rarity", item.rarity, true)
                        .addField("Type", item.type, true)
                        .addField("Effect", item.effect)
                );
            }
        }

        const all = (items as { rarity: string; name: string; description: string }[])
            .sort((a, b) => (a.name === b.name ? toRank[a.rarity] - toRank[b.rarity] : 1))
            .map((item) => ({
                name: `${toEmoji[item.rarity]} ${item.rarity} ${item.name}`,
                value: item.description,
                inline: true,
            }));

        const fields = all
            .map((_, i) => (i % itemsPerPage ? undefined : all.slice(i, Math.floor(i / itemsPerPage) * itemsPerPage + itemsPerPage)))
            .filter(($) => !!$);

        const pages = fields.map((field, i) =>
            new MessageEmbed()
                .setColor(color)
                .addFields(field!)
                .setFooter(`page ${i + 1} of ${fields.length}`)
                .setTimestamp(message.createdAt)
                .setTitle(`${message.author.username}'s inventory`)
                .setDescription("This is the stuff you have.")
                .setTimestamp()
        );

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
