import { Command } from "@aeroware/aeroclient/dist/types";
import items, { rarities } from "../../models/Item";
import users from "../../models/User";

export default {
    name: "open",
    aliases: ["crack", "crystal"],
    args: true,
    usage: "<rarity>",
    cooldown: 60,
    category: "rpg",
    description: "Opens a crystal.",
    details: "Cracks open a crystal and gives you the goodies.",
    async callback({ message, args }) {
        const user = await users.findOne({
            id: message.author.id,
        });

        if (!rarities.includes(args[0].toLowerCase())) {
            message.channel.send("That's not a rarity.");
            return "invalid";
        }

        const crystal = user.inventory.find((item: any) => item.name === "crystal" && item.rarity === args[0].toLowerCase());

        if (!crystal) {
            message.channel.send(`You don't have a ${args[0].toLowerCase()} crystal!`);
            return "invalid";
        }

        const seed = Math.random();

        const common = (
            await items.find({
                rarity: "common",
            })
        )[Math.floor(Math.random() * (await items.count()))];

        const uncommon = (
            await items.find({
                rarity: "uncommon",
            })
        )[Math.floor(Math.random() * (await items.count()))];

        const rare = (
            await items.find({
                rarity: "rare",
            })
        )[Math.floor(Math.random() * (await items.count()))];

        const epic = (
            await items.find({
                rarity: "epic",
            })
        )[Math.floor(Math.random() * (await items.count()))];

        const mythic = (
            await items.find({
                rarity: "mythic",
            })
        )[Math.floor(Math.random() * (await items.count()))];

        const legendary = (
            await items.find({
                rarity: "legendary",
            })
        )[Math.floor(Math.random() * (await items.count()))];

        switch (crystal.rarity) {
            case "common":
                if (seed < 0.0000001) user.inventory.push(legendary);
                else if (seed < 0.000001) user.inventory.push(mythic);
                else if (seed < 0.00001) user.inventory.push(epic);
                else if (seed < 0.001) user.inventory.push(rare);
                else if (seed < 0.1) user.inventory.push(uncommon);
                else user.inventory.push(common);
                break;
        }

        await user.save();

        return message.channel.send(args);
    },
} as Command;
