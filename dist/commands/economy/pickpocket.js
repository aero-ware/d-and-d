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
const User_1 = __importDefault(require("../../models/User"));
exports.default = {
    name: "pickpocket",
    aliases: ["steal", "rob"],
    args: true,
    usage: "[@user]",
    category: "economy",
    cooldown: 300,
    description: "Attempt to rob a user!",
    details: "Notifies the user that they are being pickpocketed so they have a chance to stop the theft!",
    guildOnly: true,
    callback({ message }) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const target = message.mentions.users.first();
            if (!target) {
                message.channel.send("Please mention someone!");
                return "invalid";
            }
            if (target.id === message.author.id) {
                message.channel.send("Don't rob yourself, rob someone else.");
                return "invalid";
            }
            const victim = yield User_1.default.findOne({
                _id: target.id,
            });
            if (!victim) {
                message.channel.send(`Who's ${target.username}? I've never seen them before.`);
                return "invalid";
            }
            if (victim.balance < 50) {
                message.channel.send("They don't have much; it's not worth it.");
                return "invalid";
            }
            const thief = yield User_1.default.findOne({
                _id: message.author.id,
            });
            if (victim.balance < 25) {
                message.channel.send("You don't have enough coins to pay the fee if you fail!");
                return "invalid";
            }
            const lock = yield message.channel.send(`Theft in progress... Hopefully they don't notice!`);
            yield lock.react("🔒");
            try {
                target.send(`${message.author.tag} is trying to rob you in ${(_a = message.guild) === null || _a === void 0 ? void 0 : _a.name}! Stop them quick!`);
            }
            catch (_b) { }
            const reaction = (yield lock.awaitReactions((reaction, user) => reaction.emoji.name === "🔒" && user.id === target.id, {
                max: 1,
                time: 10000,
            })).first();
            if (reaction) {
                thief.balance -= 25;
                yield thief.save();
                return message.channel.send(`Your theft failed and you payed your victim 25 coins!`);
            }
            const amount = Math.floor(victim.balance * 0.5);
            victim.balance -= amount;
            thief.balance += amount;
            yield thief.save();
            yield victim.save();
            return message.channel.send(`You picked ${amount} coins from them!`);
        });
    },
};
