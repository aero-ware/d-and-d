import { Command } from "@aeroware/aeroclient/dist/types";
import items, { rarities } from "../../models/Item";
import users from "../../models/User";
import toPower from "../../utils/toPower";

export default {
    name: "merge",
    aliases: ["combine", "craft"],
    args: true,
    usage: "<rarity> <item>",
    category: "economy",
    cooldown: 5,
    description: "Merges two items into an item of better quality.",
    details: "Merging legendary items gives lots of exp.",
    async callback({ message, args }) {
        if (!rarities.includes(args[0])) {
            message.channel.send("That's not a rarity.");
            return "invalid";
        }

        const user = await users.findOne({
            _id: message.author.id,
        });

        const inv = user.inventory.filter((item: any) => item.rarity === args[0] && item.name === args[1]);

        if (inv.length < 2) {
            message.channel.send("You don't have enough items!");
            return "invalid";
        }

        const nextRarity = rarities[rarities.indexOf(args[0]) + 1];

        if (!nextRarity) {
            const index = user.inventory.indexOf(inv[0]);
            user.inventory.splice(index, 1);
            user.exp += 1000;
            user.balance += 1;
            await user.save();
            return message.channel.send(`You merged two ${inv[0].rarity} ${inv[0].name}s and gained 1000 exp!`);
        }

        for (let i = 0; i < 2; i++) {
            const item = inv[i];
            const index = user.inventory.indexOf(item);
            user.inventory.splice(index, 1);
        }

        user.inventory.push(
            await items.findOne({
                rarity: nextRarity,
                name: args[1],
            })
        );

        user.exp += toPower[nextRarity] * 10;

        await user.save();

        return message.channel.send(
            `You merged two ${inv[0].rarity} ${inv[0].name}s and got a${nextRarity.startsWith("e") || nextRarity.startsWith("u") ? "n" : ""} ${nextRarity} ${
                args[1]
            }!`
        );
    },
} as Command;
