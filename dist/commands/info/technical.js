"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const embed_1 = __importDefault(require("../../utils/embed"));
exports.default = {
    name: "technical",
    category: "info",
    description: "About the bot's technical stuff.",
    details: "If you ever wondered how it was made.",
    cooldown: 5,
    hidden: true,
    callback({ message, client }) {
        var _a;
        message.channel.send(new embed_1.default()
            .setTitle("The Technical Stuff")
            .setDescription(`
**Dungeons & Dragons** was actually created by [AeroWare](https://github.com/aero-ware/) for testing purposes. [AeroWare](https://github.com/aero-ware/) had just released its first discord.js framework and it wanted to test it extensively.

Eventually Dungeons & Dragons was born. We thought it would be perfect to test the capabilities; Dungeons & Dragons used almost every feature of [AeroClient](https://www.npmjs.com/package/@aeroware/aeroclient).
`)
            .addField("What is AeroClient?", `
AeroClient is AeroWare's discord.js framework with many functions and features.
You can view most features in the [README.md](https://github.com/aero-ware/aeroclient).
The [documentation](https://aero-ware.github.io/aeroclient/) covers everything you need to get started, including the utils.
The framework was built around configuration and ease of use.
There are many options you can use and many things you can customize.
`)
            .addField("What tools did you use?", `
During development, we chose to use [TypeScript](https://www.typescriptlang.org/) for its type-checking and compile-time safety.
Our environment included [nodemon](https://nodemon.io/) and [ts-node](https://www.npmjs.com/package/ts-node).
With this simple set up, development was fairly smooth because the bot restarted every time a change was made.
The package manager of choice was [yarn](https://classic.yarnpkg.com/en/).
We chose yarn over npm because it was fast, reliable, and efficient.
`)
            .setThumbnail((_a = client.user) === null || _a === void 0 ? void 0 : _a.displayAvatarURL()));
    },
};
