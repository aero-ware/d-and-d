"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const embed_1 = __importDefault(require("../../utils/embed"));
exports.default = {
    name: "about",
    category: "info",
    description: "About the bot.",
    details: "If you ever wondered what this bot was for.",
    cooldown: 5,
    callback({ message, client }) {
        var _a;
        message.channel.send(new embed_1.default()
            .setTitle("About")
            .setDescription(`
**Dungeons & Dragons** was created by AeroWare for a unique bot that aims to deliver a powerful experience similar to that of the actual Dungeons & Dragons board game.

We believe that this bot carries tales of adventure and legacy of retro games.
Dungeons & Dragons has been with us for years and we wanted to bring it to a whole new level to fit with Discord.

If you have any suggestions to make the immersion and game better, you are always free to [drop by](https://discord.com/invite/8TWzS4Bjza).
`)
            .setThumbnail((_a = client.user) === null || _a === void 0 ? void 0 : _a.displayAvatarURL()));
    },
};
