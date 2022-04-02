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
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    name: "prefix",
    aliases: ["setprefix"],
    args: true,
    usage: "<prefix>",
    category: "utility",
    cooldown: 2,
    guildOnly: true,
    description: "Sets the prefix for this server or retrieves it.",
    details: "Anyone can see the prefix but only administrators can change it.",
    callback({ message, args, client }) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            if (!message.guild)
                return;
            const prefix = message.guild
                ? (yield client.prefixes.get((_a = message.guild) === null || _a === void 0 ? void 0 : _a.id)) || client.clientOptions.prefix || client.defaultPrefix
                : client.clientOptions.prefix || client.defaultPrefix;
            if (!args[0])
                return message.channel.send(`The server's prefix is \`${prefix}\`.`);
            if (!((_b = message.member) === null || _b === void 0 ? void 0 : _b.hasPermission("ADMINISTRATOR")))
                return message.channel.send("Sorry, you don't have permission.");
            client.prefixes.set((_c = message.guild) === null || _c === void 0 ? void 0 : _c.id, args[0]);
            return message.channel.send(`:white_check_mark: Set the prefix to \`${args[0]}\``);
        });
    },
};
