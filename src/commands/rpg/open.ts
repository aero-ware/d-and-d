import { Command } from "@aeroware/aeroclient/dist/types";
import { aDelayOf } from "@aeroware/discord-utils/dist/time";
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
            _id: message.author.id,
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
        const count = (await items.countDocuments()) / rarities.length;

        const common = (
            await items.find({
                rarity: "common",
            })
        )[Math.floor(Math.random() * count)];

        const uncommon = (
            await items.find({
                rarity: "uncommon",
            })
        )[Math.floor(Math.random() * count)];

        const rare = (
            await items.find({
                rarity: "rare",
            })
        )[Math.floor(Math.random() * count)];

        const epic = (
            await items.find({
                rarity: "epic",
            })
        )[Math.floor(Math.random() * count)];

        const mythic = (
            await items.find({
                rarity: "mythic",
            })
        )[Math.floor(Math.random() * count)];

        const legendary = (
            await items.find({
                rarity: "legendary",
            })
        )[Math.floor(Math.random() * count)];

        switch (crystal.rarity) {
            case "common":
                if (seed < 0.0000001) user.inventory.push(legendary);
                else if (seed < 0.000001) user.inventory.push(mythic);
                else if (seed < 0.00001) user.inventory.push(epic);
                else if (seed < 0.001) user.inventory.push(rare);
                else if (seed < 0.1) user.inventory.push(uncommon);
                else user.inventory.push(common);
                break;
            case "uncommon":
                if (seed < 0.000001) user.inventory.push(legendary);
                else if (seed < 0.00001) user.inventory.push(mythic);
                else if (seed < 0.0001) user.inventory.push(epic);
                else if (seed < 0.01) user.inventory.push(rare);
                else user.inventory.push(uncommon);
                break;
            case "rare":
                if (seed < 0.00001) user.inventory.push(legendary);
                else if (seed < 0.0001) user.inventory.push(mythic);
                else if (seed < 0.001) user.inventory.push(epic);
                else user.inventory.push(rare);
                break;
            case "epic":
                if (seed < 0.0001) user.inventory.push(legendary);
                else if (seed < 0.01) user.inventory.push(mythic);
                else user.inventory.push(epic);
                break;
            case "mythic":
                if (seed < 0.01) user.inventory.push(legendary);
                else user.inventory.push(mythic);
                break;
            case "legendary":
                user.inventory.push(legendary);
                break;
        }

        const index = user.inventory.indexOf(crystal);

        user.inventory.splice(index, 1);

        const newItem = user.inventory[user.inventory.length - 1];

        await user.save();

        const opened = await message.channel.send("Opening...");

        await aDelayOf(Math.floor(Math.random() * 1000) + 1000);

        return opened.edit(
            `You cracked open a${crystal.rarity.startsWith("e") || crystal.rarity.startsWith("u") ? "n" : ""} ${crystal.rarity} crystal and got a${
                newItem.rarity.startsWith("e") || newItem.rarity.startsWith("u") ? "n" : ""
            } **${newItem.rarity} ${newItem.name}**!`
        );
    },
} as Command;
