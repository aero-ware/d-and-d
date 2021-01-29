import { Command } from "@aeroware/aeroclient/dist/types";
import utils from "@aeroware/discord-utils";
import guilds from "../../models/Guild";
import users from "../../models/User";
import Embed from "../../utils/embed";

export default {
    name: "guild",
    args: false,
    usage: "[create|join <id>|leave|ban <id>|kick <id>|unban <id>|promote <id>|demote <id>|icon <icon url>|members]",
    category: "rpg",
    description: "Interact with your guild!",
    details: "Provides an interface to manage your guild.",
    cooldown: 5,
    async callback({ message, args, client }) {
        const user = await users.findOne({
            _id: message.author.id,
        });

        const allGuilds = await guilds.find();
        const guild = allGuilds.find((guild: any) => guild.members.includes(message.author.id));

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
                    const guildName = await utils.getReply(message, {
                        time: 15000,
                    });
                    if (!guildName) return;
                    if (allGuilds.find((g: any) => g.name === guildName.content.trim())) {
                        message.channel.send("That name is taken.");
                        return "invalid";
                    }
                    message.channel.send("What will the icon be (none for no icon)?");
                    const guildIcon = await utils.getReply(message, {
                        time: 15000,
                    });
                    if (!guildIcon) return;
                    user.balance -= 250;
                    await guilds.create({
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
                    const newGuild = allGuilds.find((guild: any) => guild.owner === args[1]);
                    if (!newGuild) {
                        message.channel.send("No guild found!");
                        return "invalid";
                    }
                    if (newGuild.banned.includes(message.author.id)) {
                        message.channel.send(`You are banned from **${newGuild.name}**!`);
                        return "invalid";
                    }
                    newGuild.members.push(message.author.id);
                    await newGuild.save();
                    return message.channel.send(`You have joined **${newGuild.name}**!`);
                case "leave":
                    if (!guild) {
                        message.channel.send("You are not in a guild!");
                        return "invalid";
                    }
                    if (guild.owner === message.author.id) {
                        message.channel.send(`Are you sure you want to delete your guild (y/n)?`);
                        const yn = await utils.getReply(message, {
                            time: 10000,
                        });
                        if (!yn) return;
                        if (yn.content.startsWith("y")) {
                            await guilds.findOneAndDelete({
                                owner: message.author.id,
                            });
                            return message.channel.send(`**${guild.name}** was deleted!`);
                        }
                        return message.channel.send(`Canceled guild deletion.`);
                    }
                    const index = guild.members.indexOf(message.author.id);
                    guild.members.splice(index, 1);
                    await guild.save();
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
                    guild.members = guild.members.filter((m: any) => !ids.includes(m));
                    await guild.save();
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
                    guild.banned = guild.banned.filter((m: any) => !ids.includes(m));
                    await guild.save();
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
                    guild.members = guild.members.filter((m: any) => !ids.includes(m));
                    await guild.save();
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
                    await guild.save();
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
                    guild.elders = guild.elders.filter((e: any) => !ids.includes(e));
                    await guild.save();
                    return message.channel.send(`Demoted ${ids.length} user${ids.length !== 1 ? "s" : ""} in **${guild.name}**!`);
                case "icon":
                    guild.icon = args[1];
                    await guild.save();
                    return message.channel.send(`Guild icon was updated!`);
                case "members":
                    const color = "#" + Math.floor(Math.random() * 16777215).toString(16);
                    const allUsers = await users.find();
                    const members = allUsers.filter((u: any) => guild.members.includes(u._id));
                    const itemsPerPage = 10;
                    const pages = members
                        .map((_: any, i: any) => (i % itemsPerPage ? undefined : members.slice(i, Math.floor(i / itemsPerPage) * itemsPerPage + itemsPerPage)))
                        .filter(($: any) => !!$)
                        .map((fields: any) =>
                            new Embed()
                                .setTitle(guild.name)
                                .setDescription(
                                    fields.map(
                                        (m: any) =>
                                            `${m._id === guild.owner ? "🌟" : guild.elders.includes(m._id) ? "⭐" : "◽"} ${
                                                client.users.cache.get(m._id)?.username || m._id
                                            } – level ${m.level}`
                                    )
                                )
                                .setColor(color)
                        );
                    return utils.paginate(message, pages, {
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

        const guildMembers = (await users.find()).filter((u: any) => guild.members.includes(u._id));
        const power = guildMembers.reduce((acc: any, cur: any) => acc + cur.level, 0);

        const embed = new Embed()
            .setTitle(guild.name)
            .addField("Leader", client.users.cache.get(guild.owner)?.username)
            .addField("Elders", guild.elders.length, true)
            .addField("Members", guild.members.length, true)
            .addField("Power", power)
            .setColor("RANDOM");

        try {
            if (guild.icon) embed.setThumbnail(guild.icon);
        } catch {}

        return message.channel.send(embed);
    },
} as Command;
