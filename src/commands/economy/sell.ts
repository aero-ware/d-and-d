import { Command } from "@aeroware/aeroclient/dist/types";
import { rarities } from "../../models/Item";
import users from "../../models/User";
import { addBal } from "../../utils/eco";
import { randInt } from "../../utils/random";
import toCost from "../../utils/toCost";

export default {
    name: "sell",
    aliases: ["pawn"],
    cooldown: 5,
    category: "economy",
    args: true,
    usage: "<rarity> <item> [amount]",
    description: "Sell your items!",
    details: "Sells an item for a refund.",
    async callback({ message, args }) {
        const user = await users.findOne({
            _id: message.author.id,
        });

        const amount = parseInt(args[2]) || 1;

        if (!rarities.includes(args[0].toLowerCase())) {
            message.channel.send("That's not a rarity.");
            return "invalid";
        }

        if (!args[1]) {
            message.channel.send("Please say the name of the item!");
            return "invalid";
        }

        const items = user.inventory.filter((item: any) => item.name === args[1].toLowerCase() && item.rarity === args[0].toLowerCase());

        if (!items.length) {
            message.channel.send("You don't have that item!");
            return "invalid";
        }

        if (items.length < amount) {
            message.channel.send("You don't have enough items!");
            return "invalid";
        }

        let total = 0;

        items.forEach((item: any) => {
            const index = user.inventory.indexOf(item);
            const refund = randInt(toCost[item.rarity], toCost[item.rarity] + 25);
            user.inventory.splice(index, 1);
            total += refund;
            addBal(message.author, refund);
        });

        await user.save();

        return message.channel.send(`You sold ${amount} ${items[0].rarity} ${items[0].name}${amount !== 1 ? "s" : ""} for ${total} coins!`);
    },
} as Command;
