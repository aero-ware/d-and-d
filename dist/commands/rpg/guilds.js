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
const Guild_1 = __importDefault(require("../../models/Guild"));
const User_1 = __importDefault(require("../../models/User"));
const embed_1 = __importDefault(require("../../utils/embed"));
const leaderboard_1 = require("../economy/leaderboard");
exports.default = {
    name: "guilds",
    args: false,
    usage: "[id]",
    category: "rpg",
    description: "View some guilds.",
    details: "View guilds to join.",
    cooldown: 5,
    callback({ message, args, client }) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            if (args[0]) {
                if (!/\d{18}/.test(args[0])) {
                    message.channel.send("Please include a valid id.");
                    return "invalid";
                }
                const guild = yield Guild_1.default.findOne({
                    owner: args[0],
                });
                if (!guild) {
                    message.channel.send(`No guild with that id found!`);
                    return "invalid";
                }
                const guildMembers = (yield User_1.default.find()).filter((u) => guild.members.includes(u._id));
                const power = guildMembers.reduce((acc, cur) => acc + cur.level, 0);
                const embed = new embed_1.default()
                    .setTitle(guild.name)
                    .addField("Leader", (_a = client.users.cache.get(guild.owner)) === null || _a === void 0 ? void 0 : _a.username)
                    .addField("Elders", guild.elders.length, true)
                    .addField("Members", guild.members.length, true)
                    .addField("Power", power)
                    .setColor("RANDOM");
                try {
                    if (guild.icon)
                        embed.setThumbnail(guild.icon);
                }
                catch (_b) { }
                return message.channel.send(embed);
            }
            const allGuilds = yield Guild_1.default.find();
            for (let i = allGuilds.length - 1; i > 0; i--) {
                let j = Math.floor(Math.random() * (i + 1)); // random index from 0 to i
                [allGuilds[i], allGuilds[j]] = [allGuilds[j], allGuilds[i]];
            }
            const color = "#" + Math.floor(Math.random() * 16777215).toString(16);
            const itemsPerPage = 6;
            const fields = yield Promise.all(allGuilds.map((guild) => __awaiter(this, void 0, void 0, function* () {
                var _c;
                return ({
                    name: `${guild.name} – ${yield leaderboard_1.getGuildPower(guild)}`,
                    value: `${(_c = client.users.cache.get(guild.owner)) === null || _c === void 0 ? void 0 : _c.tag}\n${guild.members.length} members\nInvite: ${guild.owner}`,
                    inline: false,
                });
            })));
            const chunks = fields
                .map((_, i) => (i % itemsPerPage ? undefined : fields.slice(i, Math.floor(i / itemsPerPage) * itemsPerPage + itemsPerPage)))
                .filter(($) => !!$);
            const pages = chunks.map((chunk) => new embed_1.default().setColor(color).setTitle("Guilds").addFields(chunk));
            return discord_utils_1.default.paginate(message, pages, {
                time: 120000,
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
