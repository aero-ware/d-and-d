import { Command } from "@aeroware/aeroclient/dist/types";
import { CommandCursor } from "mongodb";
import { addBal } from "../../utils/eco";

export default {
    name: "addbal",
    category: "utility",
    description: "staff only. adds coins to a user's balance",
    args: true,
    minArgs: 2,
    usage: "<user ping> <coins>",
    staffOnly: true,
    async callback({ message, args, client }): Promise<any> {
        const [id , coins] = args;
        const user = message.mentions.users?.first() || client.users.cache.get(id);

        if (!user) return message.channel.send("that user does not exist");

        try {
            const newBal = await addBal(user, parseInt(coins));

            message.channel.send(`You have given <@${user}> ${coins} coins, they now have ${newBal} coins.`, {
                allowedMentions: {
                    users: [], // for that nice ping without a ping
                },
            })  
        } catch (e) {
            return message.reply("Please provide a valid number of coins");
        }
        
        
    }
} as Command;