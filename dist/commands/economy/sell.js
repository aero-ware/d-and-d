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
const Item_1 = require("../../models/Item");
const User_1 = __importDefault(require("../../models/User"));
const eco_1 = require("../../utils/eco");
const random_1 = require("../../utils/random");
const toCost_1 = __importDefault(require("../../utils/toCost"));
exports.default = {
    name: "sell",
    aliases: ["pawn"],
    cooldown: 5,
    category: "economy",
    args: true,
    usage: "<rarity> <item> [amount]",
    description: "Sell your items!",
    details: "Sells an item for a refund.",
    callback({ message, args }) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield User_1.default.findOne({
                _id: message.author.id,
            });
            const amount = parseInt(args[2]) || 1;
            if (!Item_1.rarities.includes(args[0].toLowerCase())) {
                message.channel.send("That's not a rarity.");
                return "invalid";
            }
            if (!args[1]) {
                message.channel.send("Please say the name of the item!");
                return "invalid";
            }
            const items = user.inventory.filter((item) => item.name === args[1].toLowerCase() && item.rarity === args[0].toLowerCase());
            if (!items.length) {
                message.channel.send("You don't have that item!");
                return "invalid";
            }
            if (items.length < amount) {
                message.channel.send("You don't have enough items!");
                return "invalid";
            }
            let total = 0;
            items.forEach((item) => {
                const index = user.inventory.indexOf(item);
                const refund = random_1.randInt(toCost_1.default[item.rarity], toCost_1.default[item.rarity] + 25);
                user.inventory.splice(index, 1);
                total += refund;
                eco_1.addBal(message.author, refund);
            });
            yield user.save();
            return message.channel.send(`You sold ${amount} ${items[0].rarity} ${items[0].name}${amount !== 1 ? "s" : ""} for ${total} coins!`);
        });
    },
};
