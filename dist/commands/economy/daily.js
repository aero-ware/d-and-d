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
const Item_1 = __importDefault(require("../../models/Item"));
const User_1 = __importDefault(require("../../models/User"));
exports.default = {
    name: "daily",
    cooldown: 86400,
    category: "economy",
    description: "Get your daily reward!",
    details: "Gives you some coins, and might give you a crystal",
    callback({ message }) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield User_1.default.findOne({
                _id: message.author.id,
            });
            const amount = Math.floor(Math.random() * 20) + 10 + user.level;
            user.balance += amount;
            let c;
            if (Math.random() < 0.5) {
                const crystal = yield Item_1.default.findOne({
                    name: "crystal",
                    rarity: Math.random() < 0.5 ? "common" : "uncommon",
                });
                c = crystal;
                user.inventory.push(crystal);
            }
            yield user.save();
            return message.channel.send(`You got ${amount} coins${c ? ` and **a${c.rarity.startsWith("u") || c.rarity.startsWith("e") ? "n" : ""} ${c.rarity} ${c.name}**` : ""}!`);
        });
    },
};
