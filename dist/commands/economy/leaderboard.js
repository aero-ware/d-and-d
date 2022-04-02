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
exports.getGuildPower = exports.getPlayerPower = exports.getSkillz = void 0;
const discord_js_1 = require("discord.js");
const Guild_1 = __importDefault(require("../../models/Guild"));
const User_1 = __importDefault(require("../../models/User"));
exports.default = {
    name: "leaderboard",
    aliases: ["top", "lb", "best"],
    args: false,
    usage: "[field]",
    category: "economy",
    cooldown: 5,
    description: "Displays the top players or guilds.",
    details: "Available fields are `guilds`, `coins`, `prestige`, and `skills`.",
    callback({ message, args, client }) {
        return __awaiter(this, void 0, void 0, function* () {
            let desc = (yield User_1.default.find())
                .sort((a, b) => (b.level === a.level ? b.exp - a.exp : b.level - a.level))
                .slice(0, 10)
                .map((user, position) => { var _a; return `${[":first_place:", ":second_place:", ":third_place:"][position] || ":medal:"} ${(_a = client.users.cache.get(user._id)) === null || _a === void 0 ? void 0 : _a.tag} – ${user.level}`; })
                .join("\n");
            if (args[0]) {
                switch (args[0]) {
                    case "guilds":
                        desc = (yield Promise.all((yield Guild_1.default.find())
                            .sort((a, b) => __awaiter(this, void 0, void 0, function* () { return (yield getGuildPower(a)) - (yield getGuildPower(b)); }))
                            .slice(0, 10)
                            .map((guild, position) => __awaiter(this, void 0, void 0, function* () {
                            return `${[":first_place:", ":second_place:", ":third_place:"][position] || ":medal:"} ${guild.name} – ${yield getGuildPower(guild)}`;
                        })))).join("\n");
                        break;
                    case "coins":
                        desc = (yield User_1.default.find())
                            .sort((a, b) => b.balance - a.balance)
                            .slice(0, 10)
                            .map((user, position) => {
                            var _a;
                            return `${[":first_place:", ":second_place:", ":third_place:"][position] || ":medal:"} ${(_a = client.users.cache.get(user._id)) === null || _a === void 0 ? void 0 : _a.tag} – ${user.balance}`;
                        })
                            .join("\n");
                        break;
                    case "prestige":
                        desc = (yield User_1.default.find())
                            .sort((a, b) => b.prestige === a.prestige ? (b.level === a.level ? b.exp - a.exp : b.level - a.level) : b.prestige - a.prestige)
                            .slice(0, 10)
                            .map((user, position) => {
                            var _a;
                            return `${[":first_place:", ":second_place:", ":third_place:"][position] || ":medal:"} ${(_a = client.users.cache.get(user._id)) === null || _a === void 0 ? void 0 : _a.tag} – ${user.prestige}`;
                        })
                            .join("\n");
                        break;
                    case "skills":
                        desc = (yield User_1.default.find())
                            .sort((a, b) => getSkillz(b) - getSkillz(a))
                            .slice(0, 10)
                            .map((user, position) => {
                            var _a;
                            return `${[":first_place:", ":second_place:", ":third_place:"][position] || ":medal:"} ${(_a = client.users.cache.get(user._id)) === null || _a === void 0 ? void 0 : _a.tag} – ${getSkillz(user)}`;
                        })
                            .join("\n");
                        break;
                }
            }
            return message.channel.send(new discord_js_1.MessageEmbed()
                .setTitle(`Top ${args[0] === "guilds" ? "Guilds" : "Players"}`)
                .setColor("RANDOM")
                .setTimestamp(message.createdAt)
                .setDescription(desc));
        });
    },
};
function getSkillz(player) {
    return player.strength + player.speed + player.intelligence + player.mana;
}
exports.getSkillz = getSkillz;
function getPlayerPower(player) {
    return (1 + player.prestige) * getSkillz(player);
}
exports.getPlayerPower = getPlayerPower;
function getGuildPower(guild) {
    return __awaiter(this, void 0, void 0, function* () {
        const members = (yield User_1.default.find()).filter((u) => guild.members.includes(u._id));
        return members.reduce((acc, cur) => acc + getPlayerPower(cur), 0);
    });
}
exports.getGuildPower = getGuildPower;
