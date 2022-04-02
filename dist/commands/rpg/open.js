"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const time_1 = require("@aeroware/discord-utils/dist/time");
const Item_1 = __importStar(require("../../models/Item"));
const User_1 = __importDefault(require("../../models/User"));
exports.default = {
    name: "open",
    aliases: ["crack", "crystal"],
    args: true,
    usage: "<rarity>",
    cooldown: 60,
    category: "rpg",
    description: "Opens a crystal.",
    details: "Cracks open a crystal and gives you the goodies.",
    callback({ message, args }) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield User_1.default.findOne({
                _id: message.author.id,
            });
            if (!Item_1.rarities.includes(args[0].toLowerCase())) {
                message.channel.send("That's not a rarity.");
                return "invalid";
            }
            const crystal = user.inventory.find((item) => item.name === "crystal" && item.rarity === args[0].toLowerCase());
            if (!crystal) {
                message.channel.send(`You don't have a ${args[0].toLowerCase()} crystal!`);
                return "invalid";
            }
            const seed = Math.random();
            const count = (yield Item_1.default.countDocuments()) / Item_1.rarities.length;
            const common = (yield Item_1.default.find({
                rarity: "common",
            }))[Math.floor(Math.random() * count)];
            const uncommon = (yield Item_1.default.find({
                rarity: "uncommon",
            }))[Math.floor(Math.random() * count)];
            const rare = (yield Item_1.default.find({
                rarity: "rare",
            }))[Math.floor(Math.random() * count)];
            const epic = (yield Item_1.default.find({
                rarity: "epic",
            }))[Math.floor(Math.random() * count)];
            const mythic = (yield Item_1.default.find({
                rarity: "mythic",
            }))[Math.floor(Math.random() * count)];
            const legendary = (yield Item_1.default.find({
                rarity: "legendary",
            }))[Math.floor(Math.random() * count)];
            switch (crystal.rarity) {
                case "common":
                    if (seed < 0.0000001)
                        user.inventory.push(legendary);
                    else if (seed < 0.000001)
                        user.inventory.push(mythic);
                    else if (seed < 0.00001)
                        user.inventory.push(epic);
                    else if (seed < 0.001)
                        user.inventory.push(rare);
                    else if (seed < 0.1)
                        user.inventory.push(uncommon);
                    else
                        user.inventory.push(common);
                    break;
                case "uncommon":
                    if (seed < 0.000001)
                        user.inventory.push(legendary);
                    else if (seed < 0.00001)
                        user.inventory.push(mythic);
                    else if (seed < 0.0001)
                        user.inventory.push(epic);
                    else if (seed < 0.01)
                        user.inventory.push(rare);
                    else
                        user.inventory.push(uncommon);
                    break;
                case "rare":
                    if (seed < 0.00001)
                        user.inventory.push(legendary);
                    else if (seed < 0.0001)
                        user.inventory.push(mythic);
                    else if (seed < 0.001)
                        user.inventory.push(epic);
                    else
                        user.inventory.push(rare);
                    break;
                case "epic":
                    if (seed < 0.0001)
                        user.inventory.push(legendary);
                    else if (seed < 0.01)
                        user.inventory.push(mythic);
                    else
                        user.inventory.push(epic);
                    break;
                case "mythic":
                    if (seed < 0.01)
                        user.inventory.push(legendary);
                    else
                        user.inventory.push(mythic);
                    break;
                case "legendary":
                    user.inventory.push(legendary);
                    break;
            }
            const index = user.inventory.indexOf(crystal);
            user.inventory.splice(index, 1);
            const newItem = user.inventory[user.inventory.length - 1];
            yield user.save();
            const opened = yield message.channel.send("Opening...");
            yield time_1.aDelayOf(Math.floor(Math.random() * 1000) + 1000);
            return opened.edit(`You cracked open a${crystal.rarity.startsWith("e") || crystal.rarity.startsWith("u") ? "n" : ""} ${crystal.rarity} crystal and got a${newItem.rarity.startsWith("e") || newItem.rarity.startsWith("u") ? "n" : ""} **${newItem.rarity} ${newItem.name}**!`);
        });
    },
};
