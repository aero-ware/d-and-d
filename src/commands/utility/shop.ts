import { Command } from "@aeroware/aeroclient/dist/types";
import paginate from "@aeroware/discord-utils/dist/pagination";
import { MessageEmbed } from "discord.js";
import users from "../../models/User";
import { addBal, getBal } from "../../utils/eco";
import { fetchShop as fetchShop } from "../../utils/shopItems";
import toEmoji from "../../utils/toEmoji";

export default {
    name: "shop",
    aliases: ["store"],
    category: "utility",
    description: "Go for a walk down to your local shop.",
    details: "Opens the shop, theres not much to be said here; you can buy an item by providing the ID.",
    cooldown: 5,
    usage: "[item ID]",
    async callback({ message, args }): Promise<any> {
        const color = "#" + Math.floor(Math.random() * 16777215).toString(16);

        const items: any[] = fetchShop();

        if (parseInt(args[0]) <= items.length) {
            const itemID = parseInt(args[0]) - 1;
            const shopItem = items[itemID];

            const buyPrompt = await message.channel.send(`Do you want to by a **${shopItem.rarity} ${shopItem.name}** for **${shopItem.cost} coins**?`);

            await Promise.all([buyPrompt.react("✅"), buyPrompt.react("❌")]);

            const reactions = await buyPrompt.awaitReactions((r, u) => (r.emoji.name === "✅" || r.emoji.name === "❌") && u.id === message.author.id, {
                time: 15000,
                max: 1,
            });

            if (reactions.has("❌")) return message.channel.send("Purchase canceled.");

            const userBal = await getBal(message.author);
            if (shopItem.cost > userBal) return message.channel.send(`❌ | You don't have enough money for that purchase. You only have ${userBal} coins.`);
            await addBal(message.author, -shopItem.cost);

            await users.findByIdAndUpdate(message.author.id, {
                $push: {
                    inventory: shopItem,
                },
            });

            return message.channel.send("✅ | Purchase success!");
        }

        const itemsPerPage = 2;

        const shopFields = items.map((i, index) => ({
            name: `${toEmoji[i.rarity]} ${i.rarity} ${i.name}`,
            value: `\n**description:** ${i.description}\n**cost**: ${i.cost}\n**id:** ${index + 1}${
                index % itemsPerPage === 0 ? "\n――――――――――――――――――――――――――――――――――" : ""
            }`,
        }));

        const fields = shopFields
            .map((_, i) => (i % itemsPerPage ? undefined : shopFields.slice(i, Math.floor(i / itemsPerPage) * itemsPerPage + itemsPerPage)))
            .filter(($) => !!$);

        const pages = fields.map((field, i) =>
            new MessageEmbed()
                .setColor(color)
                .addFields(field!)
                .setFooter(`page ${i + 1} of ${fields.length}`)
                .setTimestamp()
                .setTitle("SHOP")
                .setDescription(`The shop refreshes every hour. Use \`${process.env.prefix}shop <id>\` to buy an item.`)
        );

        paginate(message, pages, {
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
