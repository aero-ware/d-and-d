import AeroClient from "@aeroware/aeroclient";
import mongoose from "mongoose";
import { mongoUri } from "./config.json";
import items, { rarities } from "./models/Item";

export default async function setup(client: AeroClient) {
    (async () => {
        try {
            await mongoose.connect(
                mongoUri,
                {
                    useNewUrlParser: true,
                    useUnifiedTopology: true,
                    useFindAndModify: false,
                    keepAlive: true,
                },
                (err) => {
                    if (err) return client.logger.error(err.stack || err.message);
                    client.logger.success("Connected to mongo");
                }
            );

            mongoose.connection.on("connect", () => {
                client.logger.success("Mongoose is connected");
            });

            mongoose.connection.on("error", (err) => {
                if (err) client.logger.error(err.stack || err.message);
            });

            mongoose.connection.on("disconnect", () => {
                client.logger.warn("Mongoose was disconnected");
            });

            mongoose.connection.on("reconnect", () => {
                client.logger.info("Mongoose has reconnected");
            });

            await Promise.all(
                rarities
                    .map((rarity) =>
                        [
                            {
                                name: "sword",
                                description: "Your classic sword. Broad and sharp; able to defeat many enemies.",
                            },
                        ].map(({ name, description }) =>
                            items.findOneAndUpdate(
                                {
                                    name,
                                    rarity,
                                },
                                {
                                    name,
                                    description,
                                    rarity,
                                },
                                {
                                    upsert: true,
                                }
                            )
                        )
                    )
                    .flat()
            );
        } catch (e) {
            console.error(e);
            process.exit(1);
        }
    })();
}
