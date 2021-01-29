import { Command } from "@aeroware/aeroclient/dist/types";
import users from "../../models/User";

export default {
    name: "point",
    aliases: ["skill", "sp"],
    cooldown: 10,
    args: true,
    usage: "<skill> [amount]",
    category: "rpg",
    description: "Spend your skill points!",
    details: "Increases your skill by spending skill points.",
    async callback({ message, args }) {
        const user = await users.findOne({
            _id: message.author.id,
        });

        if (!["strength", "speed", "mana", "intelligence"].includes(args[0])) {
            message.channel.send("That's not a skill.");
            return "invalid";
        }

        if (user[args[0]] >= 100) {
            user[args[0]] = 100;
            await user.save();
            return message.channel.send(`That skill is maxed and you can't upgrade it.`);
        }

        const amount = parseInt(args[1]) || 1;

        if (user[args[0]] + amount >= 100) return message.channel.send(`You can't spend that much on \`${args[0]}\`!`);

        if (amount > user.skillPoints) {
            message.channel.send(`You don't have that many skill points. You have only ${user.skillPoints}.`);
            return "invalid";
        }

        user[args[0]] += amount;
        user.skillPoints -= amount;

        await user.save();

        return message.channel.send(`You spent ${amount} points! Your ${args[0]} is now ${user[args[0]]}.`);
    },
} as Command;
