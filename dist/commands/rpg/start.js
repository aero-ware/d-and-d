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
const discord_utils_1 = __importDefault(require("@aeroware/discord-utils"));
const Item_1 = __importDefault(require("../../models/Item"));
const User_1 = __importDefault(require("../../models/User"));
exports.default = {
    name: "start",
    aliases: ["join", "restart"],
    category: "rpg",
    cooldown: 3600,
    description: "Join the game!",
    details: "Use this command to join the game, or restart your progress.",
    callback({ message }) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield User_1.default.findOne({
                _id: message.author.id,
            });
            if (!user) {
                return chooseClass(message);
            }
            else {
                let prestige = false;
                if (user.level >= 100 && user.strength >= 100 && user.speed >= 100 && user.intelligence >= 100 && user.speed >= 100 && user.didWin)
                    prestige = true;
                const r = yield message.channel.send(`Are you sure you want to reset your progress${prestige ? " and prestige" : ""}?`);
                yield r.react("❌");
                yield r.react("✅");
                const choice = (yield r.awaitReactions((re, usr) => usr.id === message.author.id && ["❌", "✅"].includes(re.emoji.name), {
                    max: 1,
                    time: 10000,
                })).first();
                if (!choice)
                    return "invalid";
                if (choice.emoji.name === "✅") {
                    if (prestige)
                        user.prestige++;
                    user.hotbar = [];
                    user.inventory = [];
                    user.skillPoints = 0;
                    user.location = "start";
                    user.level = 0;
                    user.exp = 0;
                    user.health = 100;
                    yield user.save();
                    return chooseClass(message);
                }
                return message.channel.send("Canceled reset!");
            }
        });
    },
};
function chooseClass(message) {
    return __awaiter(this, void 0, void 0, function* () {
        yield message.channel.send("What class do you want to be? (`warrior`, `archer`, `mage`, `tank`)");
        const choice = yield discord_utils_1.default.getReply(message, {
            keywords: ["warrior", "archer", "mage", "tank"],
            time: 10000,
        });
        if (!choice)
            return "invalid";
        const newUser = (yield User_1.default.findOne({
            _id: message.author.id,
        })) ||
            (yield User_1.default.create({
                _id: message.author.id,
            }));
        switch (choice.content) {
            case "warrior":
                //@ts-ignore
                newUser.hotbar.push(...(yield Promise.all([
                    Item_1.default.findOne({
                        name: "sword",
                        rarity: "common",
                    }),
                    Item_1.default.findOne({
                        name: "shield",
                        rarity: "common",
                    }),
                    Item_1.default.findOne({
                        name: "chestplate",
                        rarity: "common",
                    }),
                ])));
                //@ts-ignore
                newUser.intelligence = 5;
                //@ts-ignore
                newUser.speed = 5;
                //@ts-ignore
                newUser.mana = 3;
                //@ts-ignore
                newUser.strength = 10;
                break;
            case "archer":
                //@ts-ignore
                newUser.hotbar.push(...(yield Promise.all([
                    Item_1.default.findOne({
                        name: "tunic",
                        rarity: "common",
                    }),
                    Item_1.default.findOne({
                        name: "bow",
                        rarity: "common",
                    }),
                    Item_1.default.findOne({
                        name: "quiver",
                        rarity: "common",
                    }),
                ])));
                //@ts-ignore
                newUser.intelligence = 6;
                //@ts-ignore
                newUser.speed = 7;
                //@ts-ignore
                newUser.mana = 4;
                //@ts-ignore
                newUser.strength = 6;
                break;
            case "tank":
                //@ts-ignore
                newUser.hotbar.push(...(yield Promise.all([
                    Item_1.default.findOne({
                        name: "axe",
                        rarity: "common",
                    }),
                    Item_1.default.findOne({
                        name: "helmet",
                        rarity: "common",
                    }),
                    Item_1.default.findOne({
                        name: "chestplate",
                        rarity: "common",
                    }),
                ])));
                //@ts-ignore
                newUser.intelligence = 4;
                //@ts-ignore
                newUser.speed = 3;
                //@ts-ignore
                newUser.mana = 2;
                //@ts-ignore
                newUser.strength = 14;
                break;
            case "mage":
                //@ts-ignore
                newUser.hotbar.push(...(yield Promise.all([
                    Item_1.default.findOne({
                        name: "wand",
                        rarity: "common",
                    }),
                    Item_1.default.findOne({
                        name: "cloak",
                        rarity: "common",
                    }),
                    Item_1.default.findOne({
                        name: "tunic",
                        rarity: "common",
                    }),
                ])));
                //@ts-ignore
                newUser.intelligence = 8;
                //@ts-ignore
                newUser.speed = 3;
                //@ts-ignore
                newUser.mana = 7;
                //@ts-ignore
                newUser.strength = 5;
                break;
            default:
                message.channel.send("That wasn't a valid class. Try again!");
                return "invalid";
        }
        //@ts-ignore
        newUser.inventory.push(yield Item_1.default.findOne({
            name: "crystal",
            rarity: "uncommon",
        }));
        //@ts-ignore
        newUser.balance = 50;
        yield newUser.save();
        return message.channel.send(`You are now playing as a \`${choice.content}\`!`);
    });
}
