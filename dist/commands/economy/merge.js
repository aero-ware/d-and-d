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
const Item_1 = __importStar(require("../../models/Item"));
const User_1 = __importDefault(require("../../models/User"));
const toPower_1 = __importDefault(require("../../utils/toPower"));
exports.default = {
    name: "merge",
    aliases: ["combine", "craft"],
    args: true,
    usage: "<rarity> <item>",
    category: "economy",
    cooldown: 5,
    description: "Merges two items into an item of better quality.",
    details: "Merging legendary items gives lots of exp.",
    callback({ message, args }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!Item_1.rarities.includes(args[0])) {
                message.channel.send("That's not a rarity.");
                return "invalid";
            }
            const user = yield User_1.default.findOne({
                _id: message.author.id,
            });
            const inv = user.inventory.filter((item) => item.rarity === args[0] && item.name === args[1]);
            if (inv.length < 2) {
                message.channel.send("You don't have enough items!");
                return "invalid";
            }
            const nextRarity = Item_1.rarities[Item_1.rarities.indexOf(args[0]) + 1];
            if (!nextRarity) {
                const index = user.inventory.indexOf(inv[0]);
                user.inventory.splice(index, 1);
                user.exp += 1000;
                user.balance += 1;
                yield user.save();
                return message.channel.send(`You merged two ${inv[0].rarity} ${inv[0].name}s and gained 1000 exp!`);
            }
            for (let i = 0; i < 2; i++) {
                const item = inv[i];
                const index = user.inventory.indexOf(item);
                user.inventory.splice(index, 1);
            }
            user.inventory.push(yield Item_1.default.findOne({
                rarity: nextRarity,
                name: args[1],
            }));
            user.exp += toPower_1.default[nextRarity] * 10;
            yield user.save();
            return message.channel.send(`You merged two ${inv[0].rarity} ${inv[0].name}s and got a${nextRarity.startsWith("e") || nextRarity.startsWith("u") ? "n" : ""} ${nextRarity} ${args[1]}!`);
        });
    },
};
