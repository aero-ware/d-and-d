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
const leaderboard_1 = require("../economy/leaderboard");
exports.default = {
    name: "profile",
    aliases: ["p"],
    args: false,
    usage: "[user]",
    category: "info",
    cooldown: 5,
    description: "View your profile or someone else's.",
    details: "Displays a user's stats. Level, exp, coins, and skills.",
    callback({ message, args }) {
        return __awaiter(this, void 0, void 0, function* () {
            const target = discord_utils_1.default.parseUsers(args, message)[0] || message.author;
            const user = yield User_1.default.findOne({
                _id: target.id,
            });
            return message.channel.send(new discord_js_1.MessageEmbed()
                .setColor("RANDOM")
                .setTitle(`${target.username}'s profile`)
                .setDescription(`Prestige ${user.prestige}`)
                .addField(`Level ${user.level}`, `${user.exp} exp earned`, true)
                .addField("Coins", user.balance, true)
                .addField("Health", user.health, true)
                .addField("Power", leaderboard_1.getPlayerPower(user))
                .addField("Skills", `Strength: ${user.strength}\nSpeed: ${user.speed}\nMana: ${user.mana}\nIntelligence: ${user.intelligence}`, true)
                .addField("Skill points", user.skillPoints, true)
                .setThumbnail(target.displayAvatarURL()));
        });
    },
};
