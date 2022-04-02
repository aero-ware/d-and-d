"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const embed_1 = __importDefault(require("../../utils/embed"));
exports.default = {
    name: "instructions",
    aliases: ["howto", "howtoplay"],
    cooldown: 5,
    description: "Displays instructions on how to play.",
    details: "Do I really need to explain?",
    category: "utility",
    callback({ message, client }) {
        return __awaiter(this, void 0, void 0, function* () {
            const prefix = (yield client.prefixes.get(message.guild.id)) || "d!";
            message.channel.send(new embed_1.default()
                .setTitle("How to Play")
                .setDescription("This will run you through the basics of the game.")
                .addFields({
                name: "Getting started",
                value: `Run \`${prefix}start\` to begin your adventure! You will be asked to pick a class, which will give you your starter set of items.`,
            }, {
                name: "Opening Crystals",
                value: `Run \`${prefix}open <rarity>\` to open crystals. You will recieve a random item from that tier or higher.\n\n` +
                    `**TIP:** Run \`${prefix}open uncommon\` after starting to open your uncommon crystal you recieved for free!`,
            }, {
                name: "Fighting Monsters",
                value: `Run \`${prefix}fight <monster>\` to fight monsters. You can gain EXP and maybe even items!\n\n` +
                    "Be careful though, you can die while fighting and lose 20% of your coins and a random item from your hotbar.",
            }, {
                name: "Using your hotbar",
                value: "Your hotbar is where your active items will be stored. If an item is not in your hotbar, you cannot use it in fights.\n\n" +
                    `Run \`${prefix}hotbar <add|remove>\` to add/remove an item to/from your hotbar.`,
            }, {
                name: "Buying from the shop",
                value: `The shop changes every hour. Run \`${prefix}shop\` to see what is currently in stock at the shop and for how much.\n\n` +
                    "The prices fluctuate every time the shop restocks, and there is a only a finite number of items in stock at any point.\n\n" +
                    `To buy an item from the shop, run \`${prefix}shop <id>\` with the ID of the item you want to buy, and confirm your purchase.`,
            })
                .setColor("RANDOM"));
        });
    },
};
