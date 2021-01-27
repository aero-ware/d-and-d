import { Command } from "@aeroware/aeroclient/dist/types";

export default {
    name: "trade",
    aliases: ["barter", "auction"],
    cooldown: 60,
    args: true,
    usage: "<rarity> <item>",
    description: "Starts a trade.",
    details: "Use the `accept` command to accept offers made by the offer `command`.",
    async callback({ message, args }) {
        message.channel.send(args);
    },
} as Command;
