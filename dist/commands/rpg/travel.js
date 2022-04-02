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
const eco_1 = require("../../utils/eco");
const embed_1 = __importDefault(require("../../utils/embed"));
const leveling_1 = require("../../utils/leveling");
const map_1 = __importDefault(require("../../utils/map"));
exports.default = {
    name: "travel",
    aliases: ["go", "to", "map"],
    args: false,
    usage: "[direction]",
    category: "rpg",
    description: "Travel around the world!",
    details: "Navigate through the world and get rewards!",
    cooldown: 604800,
    callback({ message, args }) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield User_1.default.findOne({
                _id: message.author.id,
            });
            const location = map_1.default.get(user.location);
            if (!location) {
                console.log(`${message.author.tag}'s location is invalid!`);
                return;
            }
            const directions = Object.keys(location).filter((key) => key !== "name");
            if (args[0]) {
                if (!directions.includes(args[0])) {
                    message.channel.send(`That's not a direction. Directions are ${discord_utils_1.default.formatList(directions)}.`);
                    return "invalid";
                }
                if (!location[args[0]]) {
                    message.channel.send(`You can't go that way!`);
                    return "invalid";
                }
                const newLocation = map_1.default.get(location[args[0]]);
                if (!newLocation) {
                    console.log(`${message.author.tag}'s new location is invalid!`);
                    return;
                }
                user.location = newLocation.name;
                yield user.save();
                if (newLocation.name === "end") {
                    user.didWin = true;
                    const legendaryItems = yield Item_1.default.find();
                    const randomItem = legendaryItems[Math.floor(Math.random() * legendaryItems.length)];
                    yield leveling_1.addEXP(message.author, 1000);
                    yield eco_1.addBal(message.author, 250);
                    user.inventory.push(randomItem);
                    yield user.save();
                    return message.channel.send(`You have reached the end! You received a legendary ${randomItem.name}, 250 coins, and 1000 exp!`);
                }
                return message.channel.send(`You are now heading towards ${newLocation.name}!`);
            }
            message.channel.send(new embed_1.default()
                .setTitle(`You are at ${location.name}!`)
                .setDescription(`**Here's a list of where you can go:**\n${directions.map((key) => `\`${key}\`: ${location[key]}`).join("\n")}`));
            return "invalid";
        });
    },
};
