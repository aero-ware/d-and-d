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
    name: "point",
    aliases: ["skill", "sp"],
    cooldown: 10,
    args: true,
    usage: "<skill> [amount]",
    category: "rpg",
    description: "Spend your skill points!",
    details: "Increases your skill by spending skill points.",
    callback({ message, args }) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield User_1.default.findOne({
                _id: message.author.id,
            });
            if (!["strength", "speed", "mana", "intelligence"].includes(args[0])) {
                message.channel.send("That's not a skill.");
                return "invalid";
            }
            if (user[args[0]] >= 100) {
                user[args[0]] = 100;
                yield user.save();
                return message.channel.send(`That skill is maxed and you can't upgrade it.`);
            }
            const amount = parseInt(args[1]) || 1;
            if (user[args[0]] + amount >= 100)
                return message.channel.send(`You can't spend that much on \`${args[0]}\`!`);
            if (amount > user.skillPoints) {
                message.channel.send(`You don't have that many skill points. You have only ${user.skillPoints}.`);
                return "invalid";
            }
            user[args[0]] += amount;
            user.skillPoints -= amount;
            yield user.save();
            return message.channel.send(`You spent ${amount} points! Your ${args[0]} is now ${user[args[0]]}.`);
        });
    },
};
