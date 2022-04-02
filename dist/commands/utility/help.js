"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const ms_1 = __importDefault(require("ms"));
exports.default = {
    name: "help",
    aliases: ["commands", "h"],
    usage: "[command]",
    category: "utility",
    cooldown: 1,
    description: "Your typical help command.",
    details: "Displays all commands, but displays specific info when given a command name.",
    callback({ message, args, client }) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const { commands } = client;
            const categories = new Set();
            commands.forEach((cmd) => (cmd.category && !cmd.hidden ? categories.add(cmd.category) : null));
            const prefix = message.guild
                ? (yield client.prefixes.get((_a = message.guild) === null || _a === void 0 ? void 0 : _a.id)) || client.clientOptions.prefix || client.defaultPrefix
                : client.clientOptions.prefix || client.defaultPrefix;
            const uncategorized = client.commands
                .filter((cmd) => typeof cmd.category === "undefined" && !cmd.hidden)
                .map((cmd) => `\`${cmd.name}\``)
                .join("\n");
            const fields = Array.from(categories).map((cat) => ({
                name: cat.toLowerCase(),
                value: client.commands
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
                return message.channel.send(new discord_js_1.MessageEmbed()
                    .setTitle("Help")
                    .setColor("RANDOM")
                    .setDescription(`Use \`${prefix}help <command>\` for info on a specific command!`)
                    .setTimestamp(message.createdAt)
                    .addFields(fields));
            }
            const name = args[0].toLowerCase();
            const command = commands.get(name) || commands.find((c) => !!(c.aliases && c.aliases.includes(name)));
            if (!command) {
                message.channel.send(`Couldn't find the command \`${name}\`!`);
                return "invalid";
            }
            return message.channel.send(new discord_js_1.MessageEmbed()
                .setTitle(`Info for ${command.name}`)
                .addField("Aliases", command.aliases ? command.aliases.map((a) => `\`${a}\``).join("\n") : "None")
                .addField("Description", command.description || "None")
                .addField("Details", command.details || "None")
                .addField("Usage", `\`${prefix}${command.name}${command.usage ? " " + command.usage : ""}\``)
                .addField("Category", command.category ? command.category.toLowerCase() : "None", true)
                .addField("Cooldown", ms_1.default((command.cooldown || 0) * 1000, {
                long: true,
            }), true)
                .setColor("RANDOM")
                .setFooter((_b = client.user) === null || _b === void 0 ? void 0 : _b.tag)
                .setTimestamp(message.createdAt));
        });
    },
};
