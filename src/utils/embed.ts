import { MessageEmbed, MessageEmbedOptions } from "discord.js";

/**
 * Custom MessageEmbed class to take care of random colors and easter egg footers.
 */
export default class Embed extends MessageEmbed {
    /**
     * Array containing all easter egg footers to be added.
     */
    private static easterEggFooters = [
        "never gonna give you up",
        "you shall not pass",
        "no u",
        "i like ya cut g",
        "it's big brain time",
        "top 10 saddest anime deaths of all time",
    ];

    private static footers = [
        "merging legendary items gives lots of exp",
        "use the start command again to restart",
        "only items in your hotbar are used in fights",
        "get your daily rewards with the daily command",
        "you can join or create a guild with the guild command",
        "the inventory command displays item info if you enter an item name",
        "trade items with the trade command",
        "legendary items are never sold in the shop",
        "a guild's power is the sum of all the members' levels",
        "common crystals have an extremely small chance to give legendaries",
        "refunds from selling items vary",
        "healing or defending in a fight gives you bonus exp if you win",
    ];

    /**
     * Creates an Embed with the provided options.
     * @param data the options to use or embed to clone
     */
    constructor(data?: MessageEmbed | MessageEmbedOptions) {
        super(data);
        this.setFooter(
            Math.random() < 0.1
                ? Embed.easterEggFooters[Math.floor(Math.random() * Embed.easterEggFooters.length)]
                : Embed.footers[Math.floor(Math.random() * Embed.footers.length)]
        );
        this.setColor("RANDOM");
        this.setTimestamp();
    }
}
