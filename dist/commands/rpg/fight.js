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
const aeroclient_1 = require("@aeroware/aeroclient");
const input_1 = require("@aeroware/discord-utils/dist/input");
const Enemy_1 = __importDefault(require("../../models/Enemy"));
const Item_1 = require("../../models/Item");
const User_1 = __importDefault(require("../../models/User"));
const eco_1 = require("../../utils/eco");
const leveling_1 = require("../../utils/leveling");
const random_1 = require("../../utils/random");
const toPower_1 = __importDefault(require("../../utils/toPower"));
const toRank_1 = __importDefault(require("../../utils/toRank"));
const leaderboard_1 = require("../economy/leaderboard");
const creaturePower = {
    imp: 1.3,
    goblin: 1.7,
    spirit: 2.35,
    gremlin: 3,
    ogre: 4.25,
    dragon: 8.5,
};
exports.default = {
    name: "fight",
    aliases: ["duel", "attack"],
    category: "rpg",
    args: true,
    usage: "<user|creature>",
    description: "Fight other creatures or players!",
    details: "Turn based fighting!",
    cooldown: 300,
    callback({ message, args }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (message.mentions.users.first()) {
                // todo: fight users
                return;
            }
            else {
                if (!Object.keys(creaturePower).includes(args[0]))
                    return message.channel.send("Unrecognized creature.");
                const player = yield User_1.default.findById(message.author.id);
                const playerRating = leaderboard_1.getPlayerPower(player) / 80;
                let bonus = 0;
                let healthBonus = Math.round(player.hotbar.reduce((acc, cur) => acc + toPower_1.default[cur.rarity], 0)) * 3;
                const enemy = yield Enemy_1.default.create({
                    fighting: message.author.id,
                    name: args[0],
                    health: Math.round(creaturePower[args[0]] * 10 + Math.random() * 4 + healthBonus + playerRating),
                });
                yield fightMob(player, enemy, message, bonus, false, 0, playerRating);
                yield enemy.delete();
            }
        });
    },
};
function fightMob(player, enemy, message, bonus, mobDidDefend, turn, rating) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        const weapons = player.hotbar.filter((i) => i.type === "weapon");
        const armor = player.hotbar
            .filter((i) => i.type === "armor")
            .reduce((acc, cur) => (acc.find((a) => a.name === cur.name && a.rarity === cur.rarity) ? undefined : (acc = acc.concat([cur]))), []);
        if (!weapons.length)
            return message.channel.send("You don't have a weapon!");
        let defaultWeapon = weapons[0];
        let armorBonus = 0;
        for (const a of armor) {
            armorBonus += a.base * toPower_1.default[a.rarity];
            armorBonus *= 0.99;
        }
        armorBonus = parseFloat(armorBonus.toFixed(2));
        yield message.channel.send("What's your move (`attack`, `defend`, `heal`, `surrender`)?");
        const reply = yield input_1.getReply(message, {
            time: 30000,
            user: message.author,
            keywords: ["attack", "defend", "heal", "surrender"],
        });
        let moveMsg;
        const toLose = Math.floor(player.coins * 0.2);
        let mobDefended = false;
        if (reply) {
            let didDefend = false;
            switch (reply.content) {
                case "attack":
                    if (weapons.length >= 2) {
                        message.channel.send("Since you have multiple weapons, which one do you want to use?");
                        let itemName = (_a = (yield input_1.getReply(message, {
                            time: 15000,
                        }))) === null || _a === void 0 ? void 0 : _a.content.split(/\s+/g).slice(0, 2);
                        do {
                            if (itemName && itemName.length) {
                                const weapon = player.hotbar.find((item) => item.rarity === itemName[0].toLowerCase() && item.name === itemName[1].toLowerCase());
                                if (!weapon) {
                                    if (Item_1.rarities.includes(itemName[0]))
                                        yield message.channel.send("I couldn't find that weapon. Try again.");
                                    itemName = (_b = (yield input_1.getReply(message, {
                                        time: 15000,
                                    }))) === null || _b === void 0 ? void 0 : _b.content.split(/\s+/g).slice(0, 2);
                                }
                            }
                            else
                                return message.channel.send("Ending fight...");
                        } while (!itemName.length &&
                            !player.hotbar.find((item) => item.rarity === itemName[0].toLowerCase() && item.name === itemName[1].toLowerCase()));
                        defaultWeapon = player.hotbar.find((item) => item.rarity === itemName[0].toLowerCase() && item.name === itemName[1].toLowerCase());
                        if (!defaultWeapon)
                            return message.channel.send("Ending fight...");
                    }
                    let power = Math.round((defaultWeapon.base * toPower_1.default[defaultWeapon.rarity] + Math.random() * (1 + player.prestige) + rating) * (1 + player.strength / 400));
                    if (mobDidDefend) {
                        power *= 0.5;
                        power = Math.round(power);
                    }
                    const seed = Math.random();
                    switch (defaultWeapon.name) {
                        case "sword":
                            if (seed < 0.2)
                                power *= 2;
                            message.channel.send(`Critical hit! Double damage!`);
                            break;
                        case "bow":
                            if (seed < 0.2 * (1 - player.intelligence / 400))
                                power = 0;
                            message.channel.send(`You missed with your bow.`);
                            break;
                        case "wand":
                            if (seed < 0.2) {
                                power *= 2;
                                message.channel.send(`Your wand surges with power and doubles your damage.`);
                            }
                            else if (seed < 0.5) {
                                power += 10;
                                message.channel.send(`Your wand surges with power and boosts your damage.`);
                            }
                            else if (seed < 0.8 * (1 - player.intelligence / 400)) {
                                power = Math.floor(power / 2);
                                message.channel.send(`Your concentration wasn't enough and your wand does half as much damage.`);
                            }
                            break;
                        case "spear":
                            if (seed < 0.5 * (1 - player.intelligence / 400))
                                power = 0;
                            message.channel.send(`You missed with your spear.`);
                            break;
                        case "dagger":
                            power += turn / 2 + Math.random();
                            power = Math.round(power);
                            break;
                    }
                    const tools = player.hotbar.filter((item) => item.type === "tool");
                    const effectiveness = 1 + player.mana / 500;
                    tools.forEach((tool) => {
                        if (tool.name === "sharpener" && ["sword", "axe", "dagger", "spear"].includes(defaultWeapon.name)) {
                            power *= (1 + tool.base) * toPower_1.default[tool.rarity] * effectiveness;
                            power = Math.round(power);
                        }
                        else if (tool.name === "quiver" && defaultWeapon.name === "bow") {
                            power *= (1 + tool.base) * toPower_1.default[tool.rarity] * effectiveness;
                            power = Math.round(power);
                        }
                        else if (tool.name === "magnet") {
                            bonus += Math.floor(Math.random() * effectiveness * 5) + 1;
                            player.balance += Math.floor(Math.random() * effectiveness * 5) + 1;
                        }
                    });
                    enemy.health -= power;
                    yield message.channel.send(`You did ${power} damage to **${enemy.name}**. **${enemy.name}** has ${enemy.health < 0 ? 0 : enemy.health} health.`);
                    if (enemy.health <= 0) {
                        const exp = Math.floor(creaturePower[enemy.name] * 20 + Math.random() * 4 + bonus);
                        yield message.channel.send(`You ${Math.random() < 0.5 ? "killed" : "slayed"} **${enemy.name}** and gained ${exp} exp!`);
                        yield leveling_1.addEXP(message.author, exp);
                        yield eco_1.addBal(message.author, Math.round(exp / 4 + Math.random() * 4));
                        return yield enemy.delete();
                    }
                    break;
                case "defend":
                    bonus += Math.round(20 + rating * 2);
                    player.health += 5;
                    didDefend = true;
                    yield message.channel.send("You take a defensive stance and prepare for the enemy's attack!");
                    break;
                case "heal":
                    bonus += Math.round(10 + rating);
                    player.health += 20;
                    if (player.health > 100)
                        player.health = 100;
                    yield message.channel.send(`You healed 20 health. You have ${player.health} health.`);
                    break;
                case "surrender":
                    return message.channel.send("You quit the battle but you live to fight another day!");
                default:
                    break;
            }
            yield enemy.save();
            yield player.save();
            if (player.health <= 0)
                return killPlayer(player, message, toLose);
            mobDefended = yield enemyMove(enemy, player, message, moveMsg, reply.content, armorBonus, didDefend, rating);
        }
        else {
            return message.channel.send("You ran away and didn't gain anything.");
        }
        return yield fightMob(player, enemy, message, bonus, mobDefended, turn + 1, rating);
    });
}
function enemyMove(enemy, player, message, moveMsg, move, armor, defended, rating) {
    return __awaiter(this, void 0, void 0, function* () {
        moveMsg = yield message.channel.send(`**${enemy.name}** is making their move...`);
        let isDefending = false;
        const maxHealth = Math.ceil(creaturePower[enemy.name] * 10 + rating * 2) + 5;
        yield aeroclient_1.utils.aDelayOf(random_1.randInt(1000, 1250));
        const seed = Math.random();
        switch (move) {
            case "attack":
                if (seed < 0.4)
                    yield attack();
                else if (seed < 0.9)
                    yield defend();
                else if (enemy.health < maxHealth)
                    yield heal();
                else
                    yield attack();
                break;
            case "defend":
                if (seed < 0.3)
                    yield attack();
                else if (seed < 0.7)
                    yield defend();
                else if (enemy.health < maxHealth)
                    yield heal();
                else
                    yield attack();
                break;
            case "heal":
                if (seed < 0.3)
                    yield attack();
                else if (seed < 0.5)
                    yield defend();
                else if (enemy.health < maxHealth)
                    yield heal();
                else
                    yield defend();
                break;
        }
        function attack() {
            return __awaiter(this, void 0, void 0, function* () {
                let damageBonus = Math.round(player.hotbar.reduce((acc, cur) => acc + toPower_1.default[cur.rarity], 0));
                let dmg = Math.round((creaturePower[enemy.name] * 10 + Math.random() * 4 + player.level / 5) * (1 - armor) * (1 - player.strength / 400)) +
                    Math.floor(Math.random() * 4 + rating * 2) +
                    damageBonus;
                if (defended && player.hotbar.find((i) => i.name === "shield")) {
                    const shield = player.hotbar.filter((i) => i.name === "shield").sort((a, b) => toPower_1.default[b.rarity] - toPower_1.default[a.rarity])[0];
                    dmg *= 1 - shield.base * toPower_1.default[shield.rarity];
                    dmg = Math.round(dmg);
                }
                const shoes = player.hotbar.filter((item) => item.name === "shoes").sort((a, b) => toRank_1.default[b.rarity] - toRank_1.default[a.rarity])[0];
                const boots = player.hotbar.filter((item) => item.name === "boots").sort((a, b) => toRank_1.default[b.rarity] - toRank_1.default[a.rarity])[0];
                let dodge = player.speed / 1000;
                if (shoes)
                    dodge += 0.03 * toPower_1.default[shoes.rarity];
                else if (boots)
                    dodge += 0.01 * toPower_1.default[boots.rarity];
                if (Math.random() < dodge) {
                    dmg = 0;
                    return moveMsg.edit(`**${enemy.name}** missed and did 0 damage to you. You have ${player.health} health.`);
                }
                player.health -= dmg;
                return moveMsg.edit(`**${enemy.name}** did ${dmg} damage to you. You have ${player.health} health.`);
            });
        }
        function defend() {
            return __awaiter(this, void 0, void 0, function* () {
                enemy.health += 10;
                isDefending = true;
                return moveMsg.edit(`**${enemy.name}** takes cover to defend from your next blow!`);
            });
        }
        function heal() {
            return __awaiter(this, void 0, void 0, function* () {
                enemy.health += Math.floor(20 + Math.random() * 4 + rating * 2);
                if (enemy.health > maxHealth)
                    enemy.health = maxHealth;
                return moveMsg.edit(`**${enemy.name}** takes a break and heals.`);
            });
        }
        yield player.save();
        yield enemy.save();
        return isDefending;
    });
}
function killPlayer(player, message, toLose) {
    return __awaiter(this, void 0, void 0, function* () {
        const randomItem = player.hotbar[Math.floor(Math.random() * player.hotbar.length)];
        yield User_1.default.findByIdAndUpdate(message.author.id, {
            $pull: {
                hotbar: randomItem,
            },
            $inc: {
                coins: -Math.floor(player.coins * 0.2),
            },
        });
        player.health = 100;
        yield player.save();
        return message.channel.send(`You died. You lost ${toLose} coin${toLose !== 1 ? "s" : ""} and a${randomItem.rarity.startsWith("e") || randomItem.rarity.startsWith("u") ? "n" : ""} ${randomItem.rarity} ${randomItem.name}.`);
    });
}
