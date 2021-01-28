import { Command } from "@aeroware/aeroclient/dist/types";
import { MessageEmbed } from "discord.js";
import guilds from "../../models/Guild";
import users from "../../models/User";

export default {
    name: "leaderboard",
    aliases: ["top", "lb", "best"],
    args: false,
    usage: "[field]",
    category: "economy",
    cooldown: 5,
    description: "Displays the top players or guilds.",
    details: "Available fields are `guilds`, `coins`, and `skills`.",
    async callback({ message, args, client }) {
        let desc = (await users.find())
            .sort((a: any, b: any) => (b.level === a.level ? b.exp - a.exp : b.level - a.level))
            .slice(0, 10)
            .map(
                (user: any, position: number) =>
                    `${[":first_place:", ":second_place:", ":third_place:"][position] || ":medal:"} ${client.users.cache.get(user._id)?.tag} – ${user.level}`
            )
            .join("\n");

        if (args[0]) {
            switch (args[0]) {
                case "guilds":
                    desc = (
                        await Promise.all(
                            (await guilds.find())
                                .sort(async (a: any, b: any) => (await getPower(a)) - (await getPower(b)))
                                .slice(0, 10)
                                .map(
                                    async (guild: any, position: number) =>
                                        `${[":first_place:", ":second_place:", ":third_place:"][position] || ":medal:"} ${guild.name} – ${await getPower(
                                            guild
                                        )}`
                                )
                        )
                    ).join("\n");
                    break;
                case "coins":
                    desc = (await users.find())
                        .sort((a: any, b: any) => b.balance - a.balance)
                        .slice(0, 10)
                        .map(
                            (user: any, position: number) =>
                                `${[":first_place:", ":second_place:", ":third_place:"][position] || ":medal:"} ${client.users.cache.get(user._id)?.tag} – ${
                                    user.balance
                                }`
                        )
                        .join("\n");
                    break;
                case "skills":
                    desc = (await users.find())
                        .sort((a: any, b: any) => getSkillz(b) - getSkillz(a))
                        .slice(0, 10)
                        .map(
                            (user: any, position: number) =>
                                `${[":first_place:", ":second_place:", ":third_place:"][position] || ":medal:"} ${
                                    client.users.cache.get(user._id)?.tag
                                } – ${getSkillz(user)}`
                        )
                        .join("\n");
                    break;
            }
        }

        return message.channel.send(
            new MessageEmbed()
                .setTitle(`Top ${args[0] === "guilds" ? "Guilds" : "Players"}`)
                .setColor("RANDOM")
                .setTimestamp(message.createdAt)
                .setDescription(desc)
        );
    },
} as Command;

function getSkillz(player: any) {
    return player.strength + player.speed + player.intelligence + player.mana;
}

async function getPower(guild: any) {
    const members = (await users.find()).filter((u: any) => guild.members.includes(u._id));
    return members.reduce((acc: any, cur: any) => acc + cur.level, 0);
}
