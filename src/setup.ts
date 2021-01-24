import AeroClient from "@aeroware/aeroclient";
import mongoose from "mongoose";
import { mongoUri } from "./config.json";

export default async function setup(client: AeroClient) {
    /* Rename 'setprefix' to 'prefix' and delete commands we don't need */
    const _ = client.commands.get("setprefix");
    client.commands.delete("setprefix");
    client.commands.set("prefix", _!);
    client.commands.delete("setlocale");
    client.commands.delete("disable");
    client.commands.delete("enable");

    (async () => {
        try {
            await mongoose.connect(mongoUri, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useFindAndModify: false,
                keepAlive: true,
            });
            console.log("Connected to mongo");
        } catch (e) {
            console.error(e);
            process.exit(1);
        }
    })();
}
