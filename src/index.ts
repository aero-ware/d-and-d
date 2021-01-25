import AeroClient from "@aeroware/aeroclient";
import { prefix, token } from "./config.json";
import users from "./models/User";
import setup from "./setup";

(async () => {
    const client = new AeroClient({
        token,
        prefix,
        commandsPath: "commands",
        eventsPath: "events",
        logging: true,
        staff: ["508442553754845184", "564930157371195437", "788927424166756363"],
    });

    client.use(async ({ message, command }, next) => {
        const user = await users.findOne({
            id: message.author.id,
        });

        if (!user && command && command.name !== "start") {
            message.channel.send(`Use the \`start\` command to join the game!`);
            return next(true);
        }

        return next();
    });

    await setup(client);
})();
