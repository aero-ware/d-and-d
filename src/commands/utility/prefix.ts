import { Command } from "@aeroware/aeroclient/dist/types";

export default {
    name: "prefix",
    aliases: ["setprefix"],
    args: true,
    usage: "<prefix>",
    category: "utility",
    cooldown: 2,
    guildOnly: true,
    description: "Sets the prefix for this server or retrieves it.",
    details: "Anyone can see the prefix but only administrators can change it.",
    async callback({ message, args, client }) {
        if (!message.guild) return;

        const prefix = message.guild
            ? (await client.prefixes.get(message.guild?.id)) || client.clientOptions.prefix || client.defaultPrefix
            : client.clientOptions.prefix || client.defaultPrefix;

        if (!args[0]) return message.channel.send(`The server's prefix is \`${prefix}\`.`);

        if (!message.member?.hasPermission("ADMINISTRATOR")) return message.channel.send("Sorry, you don't have permission.");

        client.prefixes.set(message.guild?.id, args[0]);

        return message.channel.send(`:white_check_mark: Set the prefix to \`${args[0]}\``);
    },
} as Command;
