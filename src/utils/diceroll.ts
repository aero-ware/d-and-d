import utils from "@aeroware/discord-utils";
import { Message } from "discord.js";

export default async function diceRoll(message: Message, sides = 6) {
    const roll = Math.floor(Math.random() * sides) + 1;

    const rolling = await message.channel.send("Rolling...");

    await utils.aDelayOf(Math.random() * 1000 + 2500);

    rolling.edit(`You rolled a ${roll}!`);

    return roll;
}
