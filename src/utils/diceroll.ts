import utils from "@aeroware/discord-utils";
import { Message } from "discord.js";
import { randInt } from "./random";

export default async function diceRoll(message: Message, sides = 6) {
    const roll = randInt(1, sides);

    const rolling = await message.channel.send("Rolling...");

    await utils.aDelayOf(randInt(2500, Math.floor(Math.random() * 1000)));

    rolling.edit(`You rolled a ${roll}!`);

    return roll;
}
