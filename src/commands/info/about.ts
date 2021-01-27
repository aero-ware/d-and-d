import { Command } from "@aeroware/aeroclient/dist/types";
import Embed from "../../utils/embed";

export default {
    name: "about",
    category: "info",
    description: "About the bot.",
    details: "If you ever wondered what this bot was for.",
    cooldown: 5,
    callback({ message, client }) {
        message.channel.send(
            new Embed()
                .setTitle("About")
                .setDescription(
                    `
**Dungeons & Dragons** was created by AeroWare for a unique bot that aims to deliver a powerful experience similar to that of the actual Dungeons & Dragons board game.

We believe that this bot carries tales of adventure and legacy of retro games.
Dungeons & Dragons has been with us for years and we wanted to bring it to a whole new level to fit with Discord.

If you have any suggestions to make the immersion and game better, you are always free to [drop by](https://discord.com/invite/8TWzS4Bjza).
`
                )
                .setThumbnail(client.user?.displayAvatarURL()!)
        );
    },
} as Command;
