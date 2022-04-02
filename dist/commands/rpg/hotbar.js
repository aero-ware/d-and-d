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
const input_1 = require("@aeroware/discord-utils/dist/input");
const Item_1 = require("../../models/Item");
const User_1 = __importDefault(require("../../models/User"));
const embed_1 = __importDefault(require("../../utils/embed"));
const toEmoji_1 = __importDefault(require("../../utils/toEmoji"));
const toRank_1 = __importDefault(require("../../utils/toRank"));
exports.default = {
    name: "hotbar",
    aliases: ["hb", "active"],
    args: false,
    usage: "[switch|remove|add|clear]",
    category: "rpg",
    description: "Check your hotbar!",
    cooldown: 2,
    details: "Displays your hotbar.",
    callback({ message, args }) {
        var _a, _b, _c, _d, _e, _f;
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield User_1.default.findOne({
                _id: message.author.id,
            });
            if (args[0]) {
                switch (args[0]) {
                    case "remove":
                        if (!user.hotbar.length)
                            return message.channel.send("You don't have any active items!");
                        message.channel.send("What do you want to remove?");
                        const item = (_a = (yield input_1.getReply(message, {
                            time: 15000,
                        }))) === null || _a === void 0 ? void 0 : _a.content.split(" ").slice(0, 2);
                        if (!item)
                            return;
                        if (!Item_1.rarities.includes(item[0])) {
                            message.channel.send("That's not a rarity.");
                            return "invalid";
                        }
                        const hotbar = user.hotbar.find((i) => i.rarity === item[0] && i.name === item[1]);
                        if (!hotbar) {
                            message.channel.send("That's not an active item.");
                            return "invalid";
                        }
                        const index = user.hotbar.indexOf(hotbar);
                        user.hotbar.splice(index, 1);
                        user.inventory.push(hotbar);
                        yield user.save();
                        return message.channel.send(`Removed a${item[0].startsWith("e") || item[0].startsWith("u") ? "n" : ""} ${item[0]} ${item[1]} from your hotbar!`);
                    case "add":
                        if (user.hotbar.length >= 6)
                            return message.channel.send("Your hotbar is full!");
                        message.channel.send("What do you want to add?");
                        const itemToAdd = (_b = (yield input_1.getReply(message, {
                            time: 15000,
                        }))) === null || _b === void 0 ? void 0 : _b.content.split(" ").slice(0, 2);
                        if (!itemToAdd)
                            return;
                        if (!Item_1.rarities.includes(itemToAdd[0])) {
                            message.channel.send("That's not a rarity.");
                            return "invalid";
                        }
                        const inv = user.inventory.find((i) => i.rarity === itemToAdd[0] && i.name === itemToAdd[1]);
                        if (!inv) {
                            message.channel.send("You don't have that item!");
                            return "invalid";
                        }
                        const idx = user.inventory.indexOf(inv);
                        user.inventory.splice(idx, 1);
                        user.hotbar.push(inv);
                        yield user.save();
                        return message.channel.send(`Added a${itemToAdd[0].startsWith("e") || itemToAdd[0].startsWith("u") ? "n" : ""} ${itemToAdd[0]} ${itemToAdd[1]} to your hotbar!`);
                    case "switch":
                        message.channel.send("What do you want to switch out?");
                        const toRem = (_d = (_c = (yield input_1.getReply(message, {
                            time: 10000,
                        }))) === null || _c === void 0 ? void 0 : _c.content) === null || _d === void 0 ? void 0 : _d.split(" ").slice(0, 2);
                        if (!toRem)
                            return;
                        if (!Item_1.rarities.includes(toRem[0])) {
                            message.channel.send("That's not a rarity.");
                            return "invalid";
                        }
                        const toRemItem = user.hotbar.find((i) => i.rarity === toRem[0] && i.name === toRem[1]);
                        if (!toRemItem) {
                            message.channel.send("That item isn't in your hotbar!");
                            return "invalid";
                        }
                        message.channel.send("What do you want to replace it with?");
                        const toAdd = (_f = (_e = (yield input_1.getReply(message, {
                            time: 10000,
                        }))) === null || _e === void 0 ? void 0 : _e.content) === null || _f === void 0 ? void 0 : _f.split(" ").slice(0, 2);
                        if (!toAdd)
                            return;
                        if (!Item_1.rarities.includes(toRem[0])) {
                            message.channel.send("That's not a rarity.");
                            return "invalid";
                        }
                        const toAddItem = user.inventory.find((i) => i.rarity === toAdd[0] && i.name === toAdd[1]);
                        if (!toAddItem) {
                            message.channel.send("That item isn't in your inventory!");
                            return "invalid";
                        }
                        const addI = user.inventory.indexOf(toAddItem);
                        const remI = user.hotbar.indexOf(toRemItem);
                        user.hotbar.push(toAddItem);
                        user.hotbar.splice(remI, 1);
                        user.inventory.push(toRemItem);
                        user.hotbar.splice(addI, 1);
                        yield user.save();
                        return message.channel.send(`Switched out a${toRem[0].startsWith("e") || toRem[0].startsWith("u") ? "n" : ""} ${toRem[0]} ${toRem[1]} for a${toAdd[0].startsWith("e") || toAdd[0].startsWith("u") ? "n" : ""} ${toAdd[0]} ${toAdd[1]}!`);
                    case "clear":
                        user.inventory.push(...user.hotbar);
                        user.hotbar = [];
                        yield user.save();
                        return message.channel.send("Your hotbar has been cleared!");
                    default:
                        const mention = message.mentions.users.first();
                        if (mention) {
                            const target = yield User_1.default.findOne({
                                _id: mention === null || mention === void 0 ? void 0 : mention.id,
                            });
                            if (!target) {
                                message.channel.send(`I've never heard of someone named ${mention === null || mention === void 0 ? void 0 : mention.id}.`);
                                return "invalid";
                            }
                            if (!target.hotbar.length)
                                return message.channel.send("They don't have any active items!");
                            const all = target.hotbar
                                .sort((a, b) => (a.name === b.name ? toRank_1.default[a.rarity] - toRank_1.default[b.rarity] : 1))
                                .map((item) => ({
                                name: `${toEmoji_1.default[item.rarity]} ${item.rarity} ${item.name}`,
                                value: item.description,
                                inline: true,
                            }));
                            return message.channel.send(new embed_1.default()
                                .setColor("RANDOM")
                                .addFields(all)
                                .setTitle(`${mention.username}'s hotbar`)
                                .setDescription("This is the stuff they have in their hotbar."));
                        }
                }
            }
            if (!user.hotbar.length)
                return message.channel.send("You don't have any active items!");
            const all = user.hotbar
                .sort((a, b) => (a.name === b.name ? toRank_1.default[a.rarity] - toRank_1.default[b.rarity] : 1))
                .map((item) => ({
                name: `${toEmoji_1.default[item.rarity]} ${item.rarity} ${item.name}`,
                value: item.description,
                inline: true,
            }));
            return message.channel.send(new embed_1.default()
                .setColor("RANDOM")
                .addFields(all)
                .setTitle(`${message.author.username}'s hotbar`)
                .setDescription("This is the stuff you have that is in your hotbar."));
        });
    },
};
