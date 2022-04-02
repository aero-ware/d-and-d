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
const discord_utils_1 = __importDefault(require("@aeroware/discord-utils"));
const discord_js_1 = require("discord.js");
const User_1 = __importDefault(require("../../models/User"));
const toColor_1 = __importDefault(require("../../utils/toColor"));
const toEmoji_1 = __importDefault(require("../../utils/toEmoji"));
const toRank_1 = __importDefault(require("../../utils/toRank"));
exports.default = {
    name: "inventory",
    aliases: ["inv"],
    args: false,
    usage: "[item]",
    category: "info",
    description: "Check your inventory!",
    cooldown: 2,
    details: "Displays a pagination so you can inspect your items.",
    callback({ message, args }) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield User_1.default.findOne({
                _id: message.author.id,
            });
            if (!user.inventory.length)
                return message.channel.send("You don't have any items in your inventory!");
            const itemsPerPage = 6;
            const color = "#" + Math.floor(Math.random() * 16777215).toString(16);
            let items = user.inventory;
            if (args.length) {
                if (args.join(" ").length < 2)
                    return message.channel.send("Your search query must be at least two characters!");
                const regex = new RegExp(args.join(" ").replace(/[^a-zA-Z0-9 -]/g, ""), "i");
                items = user.inventory.filter((item) => regex.test(item.name) || regex.test(item.rarity) || regex.test(`${item.rarity} ${item.name}`));
                if (!items.length)
                    return message.channel.send(`No items found!`);
                const set = new Set(items);
                if (set.size === 1) {
                    const item = items[0];
                    return message.channel.send(new discord_js_1.MessageEmbed()
                        .setTitle(item.name)
                        .setColor(toColor_1.default[item.rarity])
                        .setDescription(item.description)
                        .addField("Rarity", item.rarity, true)
                        .addField("Type", item.type, true)
                        .addField("Effect", item.effect));
                }
            }
            const all = items
                .sort((a, b) => (a.name === b.name ? toRank_1.default[a.rarity] - toRank_1.default[b.rarity] : 1))
                .map((item) => ({
                name: `${toEmoji_1.default[item.rarity]} ${item.rarity} ${item.name}`,
                value: item.description,
                inline: true,
            }));
            const fields = all
                .map((_, i) => (i % itemsPerPage ? undefined : all.slice(i, Math.floor(i / itemsPerPage) * itemsPerPage + itemsPerPage)))
                .filter(($) => !!$);
            const pages = fields.map((field, i) => new discord_js_1.MessageEmbed()
                .setColor(color)
                .addFields(field)
                .setFooter(`page ${i + 1} of ${fields.length}`)
                .setTimestamp(message.createdAt)
                .setTitle(`${message.author.username}'s inventory`)
                .setDescription("This is the stuff you have.")
                .setTimestamp());
            return discord_utils_1.default.paginate(message, pages, {
                time: 60000,
                fastForwardAndRewind: {
                    time: 10000,
                },
                goTo: {
                    time: 10000,
                },
            });
        });
    },
};
