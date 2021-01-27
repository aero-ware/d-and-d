import AeroClient from "@aeroware/aeroclient";
import mongoose from "mongoose";
import items, { rarities } from "./models/Item";

export default async function setup(client: AeroClient) {
    (async () => {
        try {
            await mongoose.connect(
                process.env.mongoUri!,
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
                                effect: "Deals damage with a chance to crit.",
                                type: "weapon",
                                base: 10,
                            },
                            {
                                name: "shield",
                                description: "A bold shield to protect you from harm; can withstand many attacks.",
                                effect: "When defending, decreases incoming damage.",
                                type: "tool",
                                base: 0.5,
                            },
                            {
                                name: "chestplate",
                                description: "This shiny piece of metal will probably save you many times.",
                                effect: "Decreases incoming damage.",
                                type: "armor",
                                base: 0.5,
                            },
                            {
                                name: "bow",
                                description: "A springy bow to shoot arrows. Very powerful at long range.",
                                effect: "Does lots of damage, but has a chance to miss.",
                                type: "weapon",
                                base: 16,
                            },
                            {
                                name: "quiver",
                                description: "Leather sack to hold arrows so you don't have to carry them yourself.",
                                effect: "Increases bow damage.",
                                type: "tool",
                                base: 1.2,
                            },
                            {
                                name: "tunic",
                                description: "Light protection allowing for nimble movements.",
                                effect: "Decreases incoming damage a little, but increases speed.",
                                type: "armor",
                                base: 0.25,
                            },
                            {
                                name: "axe",
                                description: "Extremely heavy battle axe. Good for close range combat.",
                                effect: "Deals tons of damage.",
                                type: "weapon",
                                base: 14,
                            },
                            {
                                name: "helmet",
                                description: "Protects your head from incoming projectiles and dumb ideas.",
                                effect: "When defending, decreases incoming damage.",
                                type: "armor",
                                base: 0.35,
                            },
                            {
                                name: "wand",
                                description: "Yer' a wizard, Harry.",
                                effect: "Chance to cast a powerful spell for defense or attack.",
                                type: "weapon",
                                base: 12,
                            },
                            {
                                name: "cloak",
                                description: "A normal cloak that has been enchanted with magic.",
                                effect: "Decreases incoming damage a little but increases mana and intelligence.",
                                type: "armor",
                                base: 0.3,
                            },
                            {
                                name: "crystal",
                                description: "Crystals contain loot inside! Crack them open to receive the goods!",
                                effect: "When opened, crystals can drop loot better than their rarity.",
                                type: "crystal",
                                base: 0,
                            },
                            {
                                name: "boots",
                                description: "Heavy duty boots for protecting your feet from mud and dirt.",
                                effect: "Increases damage mitigation and chance of dodging attacks slightly.",
                                type: "armor",
                                base: 0.01,
                            },
                            {
                                name: "spear",
                                description: "A very prickly spear for throwing.",
                                effect: "Does lots of damage but misses a lot",
                                type: "weapon",
                                base: 20,
                            },
                            {
                                name: "shoes",
                                description: "Light protection from the dirty, nasty, filthy ground.",
                                effect: "Decreases incoming damage slightly but increases chance of dodging attacks.",
                                type: "armor",
                                base: 0.03,
                            },
                            {
                                name: "dagger",
                                description: "Short ranged weapon but very vicious and damaging.",
                                effect: "Does more damage the more combos you get in a fight.",
                                type: "weapon",
                                base: 10,
                            },
                            {
                                name: "magnet",
                                description: "A little block of lodestone for your journey.",
                                effect: "Increases exp and coin rewards.",
                                type: "tool",
                                base: 1.2,
                            },
                        ].map(({ name, description, type, effect, base }) =>
                            items.findOneAndUpdate(
                                {
                                    name,
                                    rarity,
                                },
                                {
                                    name,
                                    description,
                                    effect,
                                    type,
                                    base,
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
