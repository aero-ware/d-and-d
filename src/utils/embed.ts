import { MessageEmbed, MessageEmbedOptions } from "discord.js";

/**
 * Custom MessageEmbed class to take care of random colors and easter egg footers.
 */
export default class Embed extends MessageEmbed {
    /**
     * Array containing all easter egg footers to be added.
     */
    private static easterEggFooters: string[] = []; // todo: add stuff into this array

    /**
     * Creates an Embed with the provided options.
     * @param data the options to use or embed to clone
     */
    constructor(data?: MessageEmbed | MessageEmbedOptions) {
        super(data);
        this.setFooter(Embed.easterEggFooters[Math.floor(Math.random() * Embed.easterEggFooters.length)]);
        this.setColor("RANDOM");
        this.setTimestamp();
    }
}