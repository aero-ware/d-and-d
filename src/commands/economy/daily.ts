import { Command } from "@aeroware/aeroclient/dist/types";
import items from "../../models/Item";
import users from "../../models/User";

export default {
    name: "daily",
    cooldown: 86400,
    category: "economy",
    description: "Get your daily reward!",
    details: "Gives you some coins, and might give you a crystal",
    async callback({ message }) {
        const user = await users.findOne({
            _id: message.author.id,
        });

        const amount = Math.floor(Math.random() * 20) + 10 + user.level;
        user.balance += amount;

        let c;
        if (Math.random() < 0.5) {
            const crystal = await items.findOne({
                name: "crystal",
                rarity: Math.random() < 0.5 ? "common" : "uncommon",
            });
            c = crystal;
            user.inventory.push(crystal);
        }

        await user.save();

        return message.channel.send(
            `You got ${amount} coins${c ? ` and **a${c.rarity.startsWith("u") || c.rarity.startsWith("e") ? "n" : ""} ${c.rarity} ${c.name}**` : ""}!`
        );
    },
} as Command;
