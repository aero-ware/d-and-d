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
const User_1 = __importDefault(require("../../models/User"));
const leveling_1 = require("../../utils/leveling");
exports.default = {
    name: "heal",
    aliases: ["rejuvenate", "rest"],
    cooldown: 3600,
    description: "Heal up every hour.",
    details: "Has a chance to give some exp as well.",
    category: "rpg",
    callback({ message }) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield User_1.default.findOne({
                _id: message.author.id,
            });
            user.health += 10;
            const seed = Math.random() < 0.2;
            if (seed)
                yield leveling_1.addEXP(message.author, 10);
            return message.channel.send(`You healed 10 health${seed ? " **and got 10 exp**" : ""}!`);
        });
    },
};
