import { Command } from "@aeroware/aeroclient/dist/types";
import utils from "@aeroware/discord-utils";
import items from "../../models/Item";
import users from "../../models/User";
import { addBal } from "../../utils/eco";
import Embed from "../../utils/embed";
import { addEXP } from "../../utils/leveling";
import locations from "../../utils/map";

export default {
    name: "travel",
    aliases: ["go", "to", "map"],
    args: false,
    usage: "[direction]",
    category: "rpg",
    description: "Travel around the world!",
    details: "Navigate through the world and get rewards!",
    cooldown: 604800,
    async callback({ message, args }) {
        const user = await users.findOne({
            _id: message.author.id,
        });

        const location = locations.get(user.location);

        if (!location) {
            console.log(`${message.author.tag}'s location is invalid!`);
            return;
        }

        const directions = Object.keys(location).filter((key) => key !== "name");

        if (args[0]) {
            if (!directions.includes(args[0])) {
                message.channel.send(`That's not a direction. Directions are ${utils.formatList(directions)}.`);
                return "invalid";
            }

            if (!location[args[0]]) {
                message.channel.send(`You can't go that way!`);
                return "invalid";
            }

            const newLocation = locations.get(location[args[0]]!);

            if (!newLocation) {
                console.log(`${message.author.tag}'s new location is invalid!`);
                return;
            }

            user.location = newLocation.name;
            await user.save();

            if (newLocation.name === "end") {
                user.didWin = true;
                const legendaryItems = await items.find();
                const randomItem = legendaryItems[Math.floor(Math.random() * legendaryItems.length)];
                await addEXP(message.author, 1000);
                await addBal(message.author, 250);
                user.inventory.push(randomItem);
                await user.save();
                return message.channel.send(`You have reached the end! You received a legendary ${randomItem.name}, 250 coins, and 1000 exp!`);
            }

            return message.channel.send(`You are now heading towards ${newLocation.name}!`);
        }

        message.channel.send(
            new Embed()
                .setTitle(`You are at ${location.name}!`)
                .setDescription(`**Here's a list of where you can go:**\n${directions.map((key) => `\`${key}\`: ${location[key]}`).join("\n")}`)
        );
        return "invalid";
    },
} as Command;
