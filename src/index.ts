import AeroClient from "@aeroware/aeroclient";
import { Intents } from "discord.js";
import { config as dotenv } from "dotenv";
import users from "./models/User";
import setup from "./setup";

dotenv();

(async () => {
    const client = new AeroClient(
        {
            token: process.env.token,
            prefix: process.env.prefix,
            commandsPath: "commands",
            eventsPath: "events",
            logging: true,
            staff: ["508442553754845184", "564930157371195437", "788927424166756363"],
            async readyCallback(this: AeroClient) {
                this.logger.success("AeroClient is ready!");

                let isPrefix = false;

                this.user?.setActivity({
                    type: "PLAYING",
                    name: "Dungeons & Dragons",
                });

                setInterval(() => {
                    this.user?.setActivity({
                        type: "PLAYING",
                        name: (isPrefix = !isPrefix) ? "Dungeons & Dragons" : `${process.env.prefix}help`,
                    });
                }, 15000);

                await Promise.all(this.guilds.cache.map((g) => g.members.fetch()));
            },
        },
        {
            ws: {
                intents: [Intents.NON_PRIVILEGED, "GUILD_MEMBERS"],
            },
        }
    );

    client.use(async ({ message, command }, next) => {
        const user = await users.findOne({
            _id: message.author.id,
        });

        if (!user && command && command.name !== "start") {
            message.channel.send(`Use the \`start\` command to join the game!`);
            return next(true);
        }

        return next();
    });

    await setup(client);
})();
