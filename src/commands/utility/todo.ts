import { Command } from "@aeroware/aeroclient/dist/types";
import { TextChannel } from "discord.js";

export default {
    name: "todo",
    staffOnly: true,
    async callback({ message, args, client }) {
        message.delete();
        const channel = client.channels.cache.get("803309291603361813") as TextChannel;
        const pin = await channel.send(args.join(" "));
        await pin.pin();
        await channel.lastMessage?.delete();
    },
} as Command;
