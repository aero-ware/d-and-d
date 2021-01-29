import { Command } from "@aeroware/aeroclient/dist/types";
import users from "../../models/User";
import { addEXP } from "../../utils/leveling";

export default {
    name: "heal",
    aliases: ["rejuvenate", "rest"],
    cooldown: 3600,
    description: "Heal up every hour.",
    details: "Has a chance to give some exp as well.",
    category: "rpg",
    async callback({ message }) {
        const user = await users.findOne({
            _id: message.author.id,
        });

        user.health += 10;
        const seed = Math.random() < 0.2;
        if (seed) await addEXP(message.author, 10);

        return message.channel.send(`You healed 10 health${seed ? " **and got 10 exp**" : ""}!`);
    },
} as Command;
