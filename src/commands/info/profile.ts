import { Command } from "@aeroware/aeroclient/dist/types";
import utils from "@aeroware/discord-utils";
import { MessageEmbed } from "discord.js";
import users from "../../models/User";
import { getPlayerPower } from "../economy/leaderboard";

export default {
    name: "profile",
    aliases: ["p"],
    args: false,
    usage: "[user]",
    category: "info",
    cooldown: 5,
    description: "View your profile or someone else's.",
    details: "Displays a user's stats. Level, exp, coins, and skills.",
    async callback({ message, args }) {
        const target = utils.parseUsers(args, message)[0] || message.author;

        const user = await users.findOne({
            _id: target.id,
        });

        return message.channel.send(
            new MessageEmbed()
                .setColor("RANDOM")
                .setTitle(`${target.username}'s profile`)
                .setDescription(`Prestige ${user.prestige}`)
                .addField(`Level ${user.level}`, `${user.exp} exp earned`, true)
                .addField("Coins", user.balance, true)
                .addField("Health", user.health, true)
                .addField("Power", getPlayerPower(user))
                .addField("Skills", `Strength: ${user.strength}\nSpeed: ${user.speed}\nMana: ${user.mana}\nIntelligence: ${user.intelligence}`, true)
                .addField("Skill points", user.skillPoints, true)
                .setThumbnail(target.displayAvatarURL())
        );
    },
} as Command;
