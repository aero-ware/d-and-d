"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const mongoose_1 = __importDefault(require("mongoose"));
const Item_1 = __importStar(require("./models/Item"));
function setup(client) {
    return __awaiter(this, void 0, void 0, function* () {
        (() => __awaiter(this, void 0, void 0, function* () {
            try {
                yield mongoose_1.default.connect(process.env.mongoUri, {
                    useNewUrlParser: true,
                    useUnifiedTopology: true,
                    useFindAndModify: false,
                    keepAlive: true,
                }, (err) => {
                    if (err)
                        return client.logger.error(err.stack || err.message);
                    client.logger.success("Connected to mongo");
                });
                mongoose_1.default.connection.on("connect", () => {
                    client.logger.success("Mongoose is connected");
                });
                mongoose_1.default.connection.on("error", (err) => {
                    if (err)
                        client.logger.error(err.stack || err.message);
                });
                mongoose_1.default.connection.on("disconnect", () => {
                    client.logger.warn("Mongoose was disconnected");
                });
                mongoose_1.default.connection.on("reconnect", () => {
                    client.logger.info("Mongoose has reconnected");
                });
                yield Promise.all(Item_1.rarities
                    .map((rarity) => [
                    {
                        name: "sword",
                        description: "Your classic sword. Broad and sharp; able to defeat many enemies.",
                        effect: "Deals damage with a chance to crit.",
                        type: "weapon",
                        base: 10,
                    },
                    {
                        name: "shield",
                        description: "A bold shield to protect you from harm; can withstand many attacks.",
                        effect: "When defending, decreases incoming damage.",
                        type: "tool",
                        base: 0.2,
                    },
                    {
                        name: "chestplate",
                        description: "This shiny piece of metal will probably save you many times.",
                        effect: "Decreases incoming damage.",
                        type: "armor",
                        base: 0.2,
                    },
                    {
                        name: "bow",
                        description: "A springy bow to shoot arrows. Very powerful at long range.",
                        effect: "Does lots of damage, but has a chance to miss.",
                        type: "weapon",
                        base: 16,
                    },
                    {
                        name: "quiver",
                        description: "Leather sack to hold arrows so you don't have to carry them yourself.",
                        effect: "Increases bow damage.",
                        type: "tool",
                        base: 0.12,
                    },
                    {
                        name: "tunic",
                        description: "Light protection allowing for nimble movements.",
                        effect: "Decreases incoming damage a little, but increases speed.",
                        type: "armor",
                        base: 0.15,
                    },
                    {
                        name: "axe",
                        description: "Extremely heavy battle axe. Good for close range combat.",
                        effect: "Deals tons of damage.",
                        type: "weapon",
                        base: 14,
                    },
                    {
                        name: "helmet",
                        description: "Protects your head from incoming projectiles and dumb ideas.",
                        effect: "When defending, decreases incoming damage.",
                        type: "armor",
                        base: 0.1,
                    },
                    {
                        name: "wand",
                        description: "Yer' a wizard, Harry.",
                        effect: "Chance to cast a powerful spell for defense or attack.",
                        type: "weapon",
                        base: 12,
                    },
                    {
                        name: "cloak",
                        description: "A normal cloak that has been enchanted with magic.",
                        effect: "Decreases incoming damage a little but increases mana and intelligence.",
                        type: "armor",
                        base: 0.12,
                    },
                    {
                        name: "crystal",
                        description: "Crystals contain loot inside! Crack them open to receive the goods!",
                        effect: "When opened, crystals can drop loot better than their rarity.",
                        type: "crystal",
                        base: 0,
                    },
                    {
                        name: "boots",
                        description: "Heavy duty boots for protecting your feet from mud and dirt.",
                        effect: "Increases damage mitigation and chance of dodging attacks slightly.",
                        type: "armor",
                        base: 0.06,
                    },
                    {
                        name: "spear",
                        description: "A very prickly spear for throwing.",
                        effect: "Does lots of damage but misses a lot",
                        type: "weapon",
                        base: 20,
                    },
                    {
                        name: "shoes",
                        description: "Light protection from the dirty, nasty, filthy ground.",
                        effect: "Decreases incoming damage slightly but increases chance of dodging attacks.",
                        type: "armor",
                        base: 0.03,
                    },
                    {
                        name: "sharpener",
                        description: "A pencil sharperner, but for your weapon.",
                        effect: "Bladed weapons do more damage.",
                        type: "weapon",
                        base: 0.1,
                    },
                    {
                        name: "dagger",
                        description: "Short ranged weapon but very vicious and damaging.",
                        effect: "Does more damage the more combos you get in a fight.",
                        type: "weapon",
                        base: 10,
                    },
                    {
                        name: "magnet",
                        description: "A little block of lodestone for your journey.",
                        effect: "Increases exp and coin rewards.",
                        type: "tool",
                        base: 1.2,
                    },
                ].map(({ name, description, type, effect, base }) => Item_1.default.findOneAndUpdate({
                    name,
                    rarity,
                }, {
                    name,
                    description,
                    effect,
                    type,
                    base,
                    rarity,
                }, {
                    upsert: true,
                })))
                    .flat());
            }
            catch (e) {
                console.error(e);
                process.exit(1);
            }
        }))();
    });
}
exports.default = setup;
