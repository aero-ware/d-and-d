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
    details: "Available fields are `guilds`, `coins`, `prestige`, and `skills`.",
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
                                .sort(async (a: any, b: any) => (await getGuildPower(a)) - (await getGuildPower(b)))
                                .slice(0, 10)
                                .map(
                                    async (guild: any, position: number) =>
                                        `${[":first_place:", ":second_place:", ":third_place:"][position] || ":medal:"} ${guild.name} – ${await getGuildPower(
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
                case "prestige":
                    desc = (await users.find())
                        .sort((a: any, b: any) =>
                            b.prestige === a.prestige ? (b.level === a.level ? b.exp - a.exp : b.level - a.level) : b.prestige - a.prestige
                        )
                        .slice(0, 10)
                        .map(
                            (user: any, position: number) =>
                                `${[":first_place:", ":second_place:", ":third_place:"][position] || ":medal:"} ${client.users.cache.get(user._id)?.tag} – ${
                                    user.prestige
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

export function getSkillz(player: any) {
    return player.strength + player.speed + player.intelligence + player.mana;
}

export function getPlayerPower(player: any) {
    return (1 + player.prestige) * getSkillz(player);
}

export async function getGuildPower(guild: any) {
    const members = (await users.find()).filter((u: any) => guild.members.includes(u._id));
    return members.reduce((acc: any, cur: any) => acc + getPlayerPower(cur), 0);
}
