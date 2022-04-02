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
exports.default = {
    name: "guild",
    args: false,
    usage: "[create|join <id>|leave|ban <id>|kick <id>|unban <id>|promote <id>|demote <id>|icon <icon url>|members]",
    category: "rpg",
    description: "Interact with your guild!",
    details: "Provides an interface to manage your guild.",
    cooldown: 5,
    callback({ message, args, client }) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield User_1.default.findOne({
                _id: message.author.id,
            });
            const allGuilds = yield Guild_1.default.find();
            const guild = allGuilds.find((guild) => guild.members.includes(message.author.id));
            if (args[0]) {
                const ids = args.slice(1);
                switch (args[0]) {
                    case "create":
                        if (guild) {
                            message.channel.send("You are already in a guild!");
                            return "invalid";
                        }
                        if (user.balance < 250) {
                            message.channel.send("You need 250 coins to establish a guild!");
                            return "invalid";
                        }
                        message.channel.send("What's the guild's name?");
                        const guildName = yield discord_utils_1.default.getReply(message, {
                            time: 15000,
                        });
                        if (!guildName)
                            return;
                        if (allGuilds.find((g) => g.name === guildName.content.trim())) {
                            message.channel.send("That name is taken.");
                            return "invalid";
                        }
                        message.channel.send("What will the icon be (none for no icon)?");
                        const guildIcon = yield discord_utils_1.default.getReply(message, {
                            time: 15000,
                        });
                        if (!guildIcon)
                            return;
                        user.balance -= 250;
                        yield Guild_1.default.create({
                            name: guildName.content.trim(),
                            icon: guildIcon.content.trim() === "none" ? "" : guildIcon.content.trim(),
                            owner: message.author.id,
                            members: [message.author.id],
                        });
                        return message.channel.send(`Guild created!`);
                    case "join":
                        if (guild) {
                            message.channel.send("You are already in a guild!");
                            return "invalid";
                        }
                        if (!args[1]) {
                            message.channel.send("Please include the id!");
                            return "invalid";
                        }
                        const newGuild = allGuilds.find((guild) => guild.owner === args[1]);
                        if (!newGuild) {
                            message.channel.send("No guild found!");
                            return "invalid";
                        }
                        if (newGuild.banned.includes(message.author.id)) {
                            message.channel.send(`You are banned from **${newGuild.name}**!`);
                            return "invalid";
                        }
                        newGuild.members.push(message.author.id);
                        yield newGuild.save();
                        return message.channel.send(`You have joined **${newGuild.name}**!`);
                    case "leave":
                        if (!guild) {
                            message.channel.send("You are not in a guild!");
                            return "invalid";
                        }
                        if (guild.owner === message.author.id) {
                            message.channel.send(`Are you sure you want to delete your guild (y/n)?`);
                            const yn = yield discord_utils_1.default.getReply(message, {
                                time: 10000,
                            });
                            if (!yn)
                                return;
                            if (yn.content.startsWith("y")) {
                                yield Guild_1.default.findOneAndDelete({
                                    owner: message.author.id,
                                });
                                return message.channel.send(`**${guild.name}** was deleted!`);
                            }
                            return message.channel.send(`Canceled guild deletion.`);
                        }
                        const index = guild.members.indexOf(message.author.id);
                        guild.members.splice(index, 1);
                        yield guild.save();
                        return message.channel.send(`You have left **${guild.name}**!`);
                    case "ban":
                        if (guild.owner !== message.author.id) {
                            message.channel.send("Only the leader can ban members!");
                            return "invalid";
                        }
                        if (ids.some((arg) => !/^\d{18}$/.test(arg))) {
                            message.channel.send("Please include valid ids.");
                            return "invalid";
                        }
                        if (ids.some((arg) => guild.banned.includes(arg))) {
                            message.channel.send("Some of the ids were already banned.");
                            return "invalid";
                        }
                        guild.banned.push(...ids);
                        guild.members = guild.members.filter((m) => !ids.includes(m));
                        yield guild.save();
                        return message.channel.send(`Banned ${ids.length} user${ids.length !== 1 ? "s" : ""} from **${guild.name}**!`);
                    case "unban":
                        if (guild.owner !== message.author.id) {
                            message.channel.send("Only the leader can unban members!");
                            return "invalid";
                        }
                        if (ids.some((arg) => !/^\d{18}$/.test(arg))) {
                            message.channel.send("Please include valid ids.");
                            return "invalid";
                        }
                        guild.banned = guild.banned.filter((m) => !ids.includes(m));
                        yield guild.save();
                        return message.channel.send(`Unbanned ${ids.length} user${ids.length !== 1 ? "s" : ""} from **${guild.name}**!`);
                    case "kick":
                        if (guild.owner !== message.author.id && !guild.elders.includes(message.author.id)) {
                            message.channel.send("Only the leader and elders can kick members!");
                            return "invalid";
                        }
                        if (ids.some((arg) => !/^\d{18}$/.test(arg))) {
                            message.channel.send("Please include valid ids.");
                            return "invalid";
                        }
                        guild.members = guild.members.filter((m) => !ids.includes(m));
                        yield guild.save();
                        return message.channel.send(`Kicked ${ids.length} user${ids.length !== 1 ? "s" : ""} from **${guild.name}**!`);
                    case "promote":
                        if (guild.owner !== message.author.id) {
                            message.channel.send("Only the leader can promote members!");
                            return "invalid";
                        }
                        if (ids.some((arg) => !/^\d{18}$/.test(arg))) {
                            message.channel.send("Please include valid ids.");
                            return "invalid";
                        }
                        if (ids.some((arg) => !guild.members.includes(arg))) {
                            message.channel.send("Some of the ids aren't even members.");
                            return "invalid";
                        }
                        if (ids.some((arg) => guild.elders.includes(arg))) {
                            message.channel.send("Some of the ids are already elders.");
                            return "invalid";
                        }
                        guild.elders.push(...ids);
                        yield guild.save();
                        return message.channel.send(`Promoted ${ids.length} user${ids.length !== 1 ? "s" : ""} in **${guild.name}**!`);
                    case "demote":
                        if (guild.owner !== message.author.id) {
                            message.channel.send("Only the leader can demote members!");
                            return "invalid";
                        }
                        if (ids.some((arg) => !/^\d{18}$/.test(arg))) {
                            message.channel.send("Please include valid ids.");
                            return "invalid";
                        }
                        if (ids.some((arg) => !guild.members.includes(arg))) {
                            message.channel.send("Some of the ids aren't even members.");
                            return "invalid";
                        }
                        guild.elders = guild.elders.filter((e) => !ids.includes(e));
                        yield guild.save();
                        return message.channel.send(`Demoted ${ids.length} user${ids.length !== 1 ? "s" : ""} in **${guild.name}**!`);
                    case "icon":
                        guild.icon = args[1];
                        yield guild.save();
                        return message.channel.send(`Guild icon was updated!`);
                    case "members":
                        const color = "#" + Math.floor(Math.random() * 16777215).toString(16);
                        const allUsers = yield User_1.default.find();
                        const members = allUsers.filter((u) => guild.members.includes(u._id));
                        const itemsPerPage = 10;
                        const pages = members
                            .map((_, i) => (i % itemsPerPage ? undefined : members.slice(i, Math.floor(i / itemsPerPage) * itemsPerPage + itemsPerPage)))
                            .filter(($) => !!$)
                            .map((fields) => new embed_1.default()
                            .setTitle(guild.name)
                            .setDescription(fields.map((m) => {
                            var _a;
                            return `${m._id === guild.owner ? "🌟" : guild.elders.includes(m._id) ? "⭐" : "◽"} ${((_a = client.users.cache.get(m._id)) === null || _a === void 0 ? void 0 : _a.tag) || m._id} – level ${m.level}`;
                        }))
                            .setColor(color));
                        return discord_utils_1.default.paginate(message, pages, {
                            time: 120000,
                            fastForwardAndRewind: {
                                time: 10000,
                            },
                            goTo: {
                                time: 10000,
                            },
                        });
                }
            }
            if (!guild) {
                message.channel.send("You are not in a guild!");
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
        });
    },
};
