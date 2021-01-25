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
    });

    client.use(async ({ message }, next) => {
        const user = await users.findOne({
            id: message.author.id,
        });

        if (!user) {
            await users.create({
                id: message.author.id,
            });
        }

        next();
    });

    await setup(client);
})();
