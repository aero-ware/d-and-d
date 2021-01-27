import { Command } from "@aeroware/aeroclient/dist/types";
import utils from "@aeroware/discord-utils";
import { Message } from "discord.js";
import { rarities } from "../../models/Item";
import users from "../../models/User";

export default {
    name: "trade",
    aliases: ["barter", "auction"],
    cooldown: 300,
    category: "economy",
    args: true,
    usage: "<rarity> <item>",
    description: "Starts a trade.",
    details: "Use the `accept` command to accept offers made by the offer `command`.",
    async callback({ message, args }) {
        if (!rarities.includes(args[0])) {
            message.channel.send("That's not a rarity.");
            return "invalid";
        }

        const user = await users.findOne({
            _id: message.author.id,
        });

        const item = user.inventory.find((item: any) => item.rarity === args[0] && item.name === args[1]);

        if (!item) {
            message.channel.send("You don't have that item!");
            return "invalid";
        }

        const regex = new RegExp(message.author.id);

        const offers: { [_: string]: any } = {};

        const collector = message.channel.createMessageCollector(() => true, {
            time: 300000,
        });

        collector.on("collect", async (msg: Message) => {
            if (!msg.content.startsWith(process.env.prefix!) || msg.author.bot) return;

            const args = msg.content.slice(process.env.prefix?.length).split(/\s+/g);
            const command = args.shift();

            if (!command) return;

            switch (command) {
                case "end":
                    if (msg.author.id === message.author.id) collector.stop();
                    break;
                case "accept":
                    if (msg.author.id === message.author.id && /\d{18}/.test(args[0])) {
                        const customer = utils.parseUsers(args, message)[0];
                        if (!customer) return message.channel.send("Please include who's offer you'd like to accept.");
                        const id = args[0].match(/\d{18}/)![0];
                        const offer = offers[id];
                        if (!offer) return message.channel.send("They didn't offer anything!");
                        const index = user.inventory.indexOf(item);
                        if (index === -1) {
                            message.channel.send("The item you are trading is missing!");
                            return collector.stop();
                        }
                        const buyer = await users.findOne({
                            _id: id,
                        });
                        const idx = buyer.inventory.findIndex((item: any) => item.rarity === offer.rarity && item.name === offer.name);
                        if (idx === -1) {
                            message.channel.send("The item they are trading is missing!");
                            return collector.stop();
                        }
                        user.inventory.push(offer);
                        buyer.inventory.push(item);
                        user.inventory.splice(index, 1);
                        buyer.inventory.splice(idx, 1);
                        await user.save();
                        await buyer.save();
                        message.channel.send(
                            `You traded **a${item.rarity.startsWith("e") || item.rarity.startsWith("u") ? "n" : ""} ${item.rarity} ${item.name}** for **a${
                                offer.rarity.startsWith("e") || offer.rarity.startsWith("u") ? "n" : ""
                            } ${offer.rarity} ${offer.name}**!`
                        );
                        collector.stop();
                    }
                    break;
                case "offer":
                    if (msg.author.id !== message.author.id && regex.test(args[0])) {
                        if (!rarities.includes(args[1])) return message.channel.send("That's not a rarity.");
                        const customer = await users.findOne({
                            _id: msg.author.id,
                        });
                        if (!customer) return;
                        const item = customer.inventory.find((item: any) => item.rarity === args[1] && item.name === args[2]);
                        if (!item) return message.channel.send("You don't have that item in your inventory!");
                        offers[msg.author.id] = item;
                        return message.channel.send(":white_check_mark: | Recorded your offer!");
                    }
                    break;
            }

            return;
        });

        collector.on("end", () => {
            message.channel.send(`<@!${message.author.id}>'s trade has ended!`);
        });

        return message.channel.send(
            `You a started a trade for your **${item.rarity} ${item.name}**! Use \`${process.env.prefix}offer <user> <rarity> <item>\` to offer an item and use \`${process.env.prefix}accept <user>\` to accept offers.`
        );
    },
} as Command;
