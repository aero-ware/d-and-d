import { Command } from "@aeroware/aeroclient/dist/types";
import utils from "@aeroware/discord-utils";
import guilds from "../../models/Guild";
import users from "../../models/User";
import Embed from "../../utils/embed";
import { getGuildPower } from "../economy/leaderboard";

export default {
    name: "guilds",
    args: false,
    usage: "[id]",
    category: "rpg",
    description: "View some guilds.",
    details: "View guilds to join.",
    cooldown: 5,
    async callback({ message, args, client }) {
        if (args[0]) {
            if (!/\d{18}/.test(args[0])) {
                message.channel.send("Please include a valid id.");
                return "invalid";
            }

            const guild = await guilds.findOne({
                owner: args[0],
            });

            if (!guild) {
                message.channel.send(`No guild with that id found!`);
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
        }

        const allGuilds = await guilds.find();

        for (let i = allGuilds.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1)); // random index from 0 to i
            [allGuilds[i], allGuilds[j]] = [allGuilds[j], allGuilds[i]];
        }

        const color = "#" + Math.floor(Math.random() * 16777215).toString(16);
        const itemsPerPage = 6;
        const fields = await Promise.all(
            allGuilds.map(async (guild: any) => ({
                name: `${guild.name} – ${await getGuildPower(guild)}`,
                value: `${client.users.cache.get(guild.owner)?.tag}\n${guild.members.length} members\nInvite: ${guild.owner}`,
                inline: false,
            }))
        );
        const chunks = fields
            .map((_: any, i: any) => (i % itemsPerPage ? undefined : fields.slice(i, Math.floor(i / itemsPerPage) * itemsPerPage + itemsPerPage)))
            .filter(($: any) => !!$);
        const pages = chunks.map((chunk: any) => new Embed().setColor(color).setTitle("Guilds").addFields(chunk));

        return utils.paginate(message, pages, {
            time: 120000,
            fastForwardAndRewind: {
                time: 10000,
            },
            goTo: {
                time: 10000,
            },
        });
    },
} as Command;
