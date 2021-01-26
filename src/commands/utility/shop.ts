import { Command } from "@aeroware/aeroclient/dist/types";
import paginate from "@aeroware/discord-utils/dist/pagination";
import { MessageEmbed } from "discord.js";
import { fetchShop as fetchShop } from "../../utils/shopItems";
import toEmoji from "../../utils/toEmoji";
import { sentenceCase } from "../../utils/parseCase";
import { addBal, getBal } from "../../utils/eco";
import users from "../../models/User";

export default {
    name: "shop",
    aliases: ["store"],
    category: "utility",
    description: "go for a walk down to your RPGShop.",
    details: "opens the shop, theres not much to be said here, you can buy an item by providing the ID as an argument.",
    cooldown: 10,
    usage: "[item ID]",
    async callback({ message, args }): Promise<any> {
        const items: any[] = fetchShop();

        if (parseInt(args[0]) <= items.length) {
            const itemID = parseInt(args[0]) - 1;
            const shopItem = items[itemID];

            const buyPrompt = await message.channel.send(`Do you want to by a **${shopItem.rarity} ${shopItem.name}** for **${shopItem.cost} coins**?`);
            await Promise.all([
                buyPrompt.react("✅"),
                buyPrompt.react("❌")
            ]);

            const reactions = await buyPrompt.awaitReactions((r, u) => (r.emoji.name === "✅" || r.emoji.name === "❌") && u.id === message.author.id, {
                time: 15000,
                max: 1,
            });

            if (reactions.has("❌")) return message.channel.send("Purchase canceled");
            else {
                const userBal = await getBal(message.author);
                if (shopItem.cost > userBal) return message.channel.send(`❌ | You don't have enough money for that purchase. You only have ${userBal} coins.`);
                await addBal(message.author, -shopItem.cost);

                delete shopItem.cost;
                await users.findByIdAndUpdate(message.author.id, {
                    $push: {
                        inventory: shopItem,
                    },
                });

                return message.channel.send("✅ | Purchase success!");
            }
        }

        const shopFields = items.map((i, index) => {
            return {
                name: sentenceCase(i.name) || 'error',
                value: `**rarity:** ${toEmoji[i.rarity]} ${sentenceCase(i.rarity)}\n**description:** ${sentenceCase(i.description)}\n**type:** ${sentenceCase(i.type)}\n**cost**: ${i.cost}\n**id:** ${index + 1}`,
            };
        });

        const itemsPerPage = 3;
        const fields = shopFields
            .map((_, i) => (i % itemsPerPage ? undefined : shopFields.slice(i, Math.floor(i / itemsPerPage) * itemsPerPage + itemsPerPage)))
            .filter(($) => !!$);

        const pages = fields.map((field, i) => new MessageEmbed()
            .setColor("#a0433f")
            .addFields(field!)
            .setFooter(`page ${i + 1} of ${fields.length}`)
            .setTimestamp()
            .setTitle("SHOP")
            .setDescription('The shop refreshes every hour.')
        );

        paginate(message, pages, {
            time: 60000,
            goTo: {
                time: 10000,
                prompt: "enter the page you would like to go to:"
            }
        });
    }
} as Command;