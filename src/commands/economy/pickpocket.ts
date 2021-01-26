import { Command } from "@aeroware/aeroclient/dist/types";
import users from "../../models/User";

export default {
    name: "pickpocket",
    aliases: ["steal", "rob"],
    args: true,
    usage: "[@user]",
    category: "economy",
    cooldown: 300,
    description: "Attempt to rob a user!",
    details: "Notifies the user that they are being pickpocketed so they have a chance to stop the theft!",
    guildOnly: true,
    async callback({ message }) {
        const target = message.mentions.users.first();

        if (!target) {
            message.channel.send("Please mention someone!");
            return "invalid";
        }

        const victim = await users.findOne({
            _id: target.id,
        });

        if (!victim) {
            message.channel.send(`Who's ${target.username}? I've never seen them before.`);
            return "invalid";
        }

        if (victim.balance < 50) {
            message.channel.send("They don't have much; it's not worth it.");
            return "invalid";
        }

        const thief = await users.findOne({
            _id: message.author.id,
        });

        if (victim.balance < 25) {
            message.channel.send("You don't have enough coins to pay the fee if you fail!");
            return "invalid";
        }

        const lock = await message.channel.send(`Theft in progress... Hopefully they don't notice!`);
        await lock.react("🔒");

        try {
            target.send(`${message.author.tag} is trying to rob you in ${message.guild?.name}! Stop them quick!`);
        } catch {}

        const reaction = (
            await lock.awaitReactions((reaction, user) => reaction.emoji.name === "🔒" && user.id === target.id, {
                max: 1,
                time: 10000,
            })
        ).first();

        if (reaction) {
            thief.balance -= 25;
            await thief.save();

            return message.channel.send(`Your theft failed and you payed your victim 25 coins!`);
        }

        const amount = Math.floor(victim.balance * 0.5);

        victim.balance -= amount;
        thief.balance += amount;

        await thief.save();
        await victim.save();

        return message.channel.send(`You picked ${amount} coins from them!`);
    },
} as Command;
