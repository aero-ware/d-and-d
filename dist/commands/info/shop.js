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
const pagination_1 = __importDefault(require("@aeroware/discord-utils/dist/pagination"));
const discord_js_1 = require("discord.js");
const Item_1 = __importDefault(require("../../models/Item"));
const User_1 = __importDefault(require("../../models/User"));
const eco_1 = require("../../utils/eco");
const shopItems_1 = require("../../utils/shopItems");
const toEmoji_1 = __importDefault(require("../../utils/toEmoji"));
exports.default = {
    name: "shop",
    aliases: ["store", "buy"],
    category: "info",
    description: "Go for a walk down to your local shop.",
    details: "Opens the shop, theres not much to be said here; you can buy an item by providing the ID.",
    cooldown: 5,
    usage: "[item ID]",
    callback({ message, args }) {
        return __awaiter(this, void 0, void 0, function* () {
            const color = "#" + Math.floor(Math.random() * 16777215).toString(16);
            const items = shopItems_1.fetchShop();
            if (parseInt(args[0]) <= items.length) {
                const itemID = parseInt(args[0]) - 1;
                const shopItem = items[itemID];
                const userBal = yield eco_1.getBal(message.author);
                if (shopItem.cost > userBal) {
                    message.channel.send(`❌ | You don't have enough money for that purchase. You only have ${userBal} coins.`);
                    return "invalid";
                }
                const buyPrompt = yield message.channel.send(`Do you want to by a **${shopItem.rarity} ${shopItem.name}** for **${shopItem.cost} coins**?`);
                yield Promise.all([buyPrompt.react("✅"), buyPrompt.react("❌")]);
                const reactions = yield buyPrompt.awaitReactions((r, u) => (r.emoji.name === "✅" || r.emoji.name === "❌") && u.id === message.author.id, {
                    time: 15000,
                    max: 1,
                });
                if (reactions.has("❌"))
                    return message.channel.send("Purchase canceled.");
                shopItem.stock--;
                yield eco_1.addBal(message.author, -shopItem.cost);
                const itemToAdd = yield Item_1.default.findOne({
                    name: shopItem.name,
                    rarity: shopItem.rarity,
                });
                yield User_1.default.findByIdAndUpdate(message.author.id, {
                    $push: {
                        inventory: itemToAdd,
                    },
                });
                return message.channel.send("✅ | Purchase success!");
            }
            const itemsPerPage = 2;
            const shopFields = items.map((i, index) => ({
                name: `${toEmoji_1.default[i.rarity]} ${i.rarity} ${i.name}`,
                value: `\n**description:** ${i.description}\n**cost**: ${i.cost}\n**amount left**: ${i.stock}\n**id:** ${index + 1}${index % itemsPerPage === 0 ? "\n――――――――――――――――――――――――――――――――――" : ""}`,
            }));
            const fields = shopFields
                .map((_, i) => (i % itemsPerPage ? undefined : shopFields.slice(i, Math.floor(i / itemsPerPage) * itemsPerPage + itemsPerPage)))
                .filter(($) => !!$);
            const pages = fields.map((field, i) => new discord_js_1.MessageEmbed()
                .setColor(color)
                .addFields(field)
                .setFooter(`page ${i + 1} of ${fields.length}`)
                .setTimestamp()
                .setTitle("SHOP")
                .setDescription(`The shop refreshes every hour. Use \`${process.env.prefix}shop <id>\` to buy an item.`));
            pagination_1.default(message, pages, {
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
