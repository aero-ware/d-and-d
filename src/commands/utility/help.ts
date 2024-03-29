import { Command } from "@aeroware/aeroclient/dist/types";
import { MessageEmbed } from "discord.js";
import ms from "ms";

export default {
    name: "help",
    aliases: ["commands", "h"],
    usage: "[command]",
    category: "utility",
    cooldown: 1,
    description: "Your typical help command.",
    details: "Displays all commands, but displays specific info when given a command name.",
    async callback({ message, args, client }) {
        const { commands } = client;

        const categories = new Set<string>();

        commands.forEach((cmd) => (cmd.category && !cmd.hidden ? categories.add(cmd.category) : null));

        const prefix = message.guild
            ? (await client.prefixes.get(message.guild?.id)) || client.clientOptions.prefix || client.defaultPrefix
            : client.clientOptions.prefix || client.defaultPrefix;

        const uncategorized = client.commands
            .filter((cmd) => typeof cmd.category === "undefined" && !cmd.hidden)
            .map((cmd) => `\`${cmd.name}\``)
            .join("\n");

        const fields = Array.from(categories).map((cat) => ({
            name: cat.toLowerCase(),
            value:
                client.commands
                    .filter((cmd) => cmd.category === cat && !cmd.hidden)
                    .map((cmd) => `\`${cmd.name}\``)
                    .join("\n") || "None",
            inline: true,
        }));

        if (uncategorized)
            fields.push({
                name: "uncategorized",
                value: uncategorized,
                inline: true,
            });

        if (!args.length) {
            return message.channel.send(
                new MessageEmbed()
                    .setTitle("Help")
                    .setColor("RANDOM")
                    .setDescription(`Use \`${prefix}help <command>\` for info on a specific command!`)
                    .setTimestamp(message.createdAt)
                    .addFields(fields)
            );
        }

        const name = args[0].toLowerCase();
        const command = commands.get(name) || commands.find((c) => !!(c.aliases && c.aliases.includes(name)));

        if (!command) {
            message.channel.send(`Couldn't find the command \`${name}\`!`);
            return "invalid";
        }

        return message.channel.send(
            new MessageEmbed()
                .setTitle(`Info for ${command.name}`)
                .addField("Aliases", command.aliases ? command.aliases.map((a) => `\`${a}\``).join("\n") : "None")
                .addField("Description", command.description || "None")
                .addField("Details", command.details || "None")
                .addField("Usage", `\`${prefix}${command.name}${command.usage ? " " + command.usage : ""}\``)
                .addField("Category", command.category ? command.category.toLowerCase() : "None", true)
                .addField(
                    "Cooldown",
                    ms((command.cooldown || 0) * 1000, {
                        long: true,
                    }),
                    true
                )
                .setColor("RANDOM")
                .setFooter(client.user?.tag)
                .setTimestamp(message.createdAt)
        );
    },
} as Command;
