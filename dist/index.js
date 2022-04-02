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
const aeroclient_1 = __importDefault(require("@aeroware/aeroclient"));
const discord_js_1 = require("discord.js");
const dotenv_1 = require("dotenv");
const User_1 = __importDefault(require("./models/User"));
const setup_1 = __importDefault(require("./setup"));
dotenv_1.config();
(() => __awaiter(void 0, void 0, void 0, function* () {
    const staff = ["508442553754845184", "564930157371195437", "788927424166756363"];
    const client = new aeroclient_1.default({
        token: process.env.token,
        prefix: process.env.prefix,
        commandsPath: "commands",
        // eventsPath: "events",
        logging: true,
        staff,
        readyCallback() {
            var _a;
            return __awaiter(this, void 0, void 0, function* () {
                this.logger.success("AeroClient is ready!");
                let isPrefix = false;
                (_a = this.user) === null || _a === void 0 ? void 0 : _a.setActivity({
                    type: "PLAYING",
                    name: "Dungeons & Dragons",
                });
                setInterval(() => {
                    var _a;
                    (_a = this.user) === null || _a === void 0 ? void 0 : _a.setActivity({
                        type: "PLAYING",
                        name: (isPrefix = !isPrefix) ? "Dungeons & Dragons" : `${process.env.prefix}help`,
                    });
                }, 15000);
                yield Promise.all(this.guilds.cache.map((g) => g.members.fetch()));
            });
        },
    }, {
        ws: {
            intents: [discord_js_1.Intents.NON_PRIVILEGED, "GUILD_MEMBERS"],
        },
    });
    client.use(({ message, command, args }, next) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        const regex = new RegExp(`^<@!?${(_a = client.user) === null || _a === void 0 ? void 0 : _a.id}>$`);
        if (regex.test(message.content)) {
            (_b = client.commands.get("prefix")) === null || _b === void 0 ? void 0 : _b.callback({
                args,
                client,
                message,
                text: message.content,
                locale: "",
            });
            return next(true);
        }
        const user = yield User_1.default.findOne({
            _id: message.author.id,
        });
        if (!user && command && command.name !== "start") {
            message.channel.send(`Use the \`start\` command to join the game!`);
            return next(true);
        }
        return next();
    }));
    yield setup_1.default(client);
}))();
