import { Command } from "@aeroware/aeroclient/dist/types";
import { MessageEmbed } from "discord.js";
import Embed from "../../utils/embed"; // todo: fix Embed

export default {
    name: "instructions",
    aliases: ["howto", "howtoplay"],
    async callback({ message, client }) {
        const prefix = await client.prefixes.get(message.guild!.id) || "d!";
        message.channel.send(
            new Embed() // todo: fix Embed so it can be here instead
                .setTitle("How to Play")
                .setDescription("This Message will run you through the basics of the game.")
                .addFields(
                    {
                        name: "Getting started",
                        value: `Run \`${prefix}start\` to begin your adventure! You will be asked to pick a class, which will give you your starter set of items.`
                    },
                    {
                        name: "Opening Crystals",
                        value: `Run \`${prefix}open <rarity>\` to open crystals. You will recieve a random item from that tier or higher.\n\n` + 
                            `**TIP:** Run \`${prefix}open uncommon\` after starting to open your uncommon crystal you recieved for free!`
                    },
                    {
                        name: "Fighting Monsters",
                        value: `Run \`${prefix}fight <monster>\` to fight monsters. You can gain EXP and maybe even items!\n\n` + 
                            "Be careful though, you can die while fighting and lose 20% of your coins and a random item from your hotbar."
                    },
                    {
                        name: "Using your hotbar",
                        value: "Your hotbar is where your active items will be stored. If an item is not in your hotbar, you cannot use it in fights.\n\n" + 
                            `Run \`${prefix}hotbar <add|remove>\` to add/remove an item to/from your hotbar.`
                    },
                    {
                        name: "Buying from the shop",
                        value: `The shop changes every hour. Run \`${prefix}shop\` to see what is currently in stock at the shop and for how much.\n\n` + 
                            "The prices fluctuate every time the shop restocks, and there is a only a finite number of items in stock at any point.\n\n" + 
                            `To buy an item from the shop, run \`${prefix}shop <id>\` with the ID of the item you want to buy, and confirm your purchase.`
                    },
                    {
                        name: "There's a lot more to this but I don't know what else to add",
                        value: "<@508442553754845184> would know what to add tho"
                    }
                )
                .setColor("RANDOM")
        );
    }
} as Command;