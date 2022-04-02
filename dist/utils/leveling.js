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
exports.setInfo = exports.getInfo = exports.addLevel = exports.addEXP = exports.requiredEXP = void 0;
const User_1 = __importDefault(require("../models/User"));
/**
 * Returns the required amount of EXP the user needs to level up.
 * @param level the level of the user
 * @returns the amount of EXP required to level up
 */
function requiredEXP(level) {
    return Math.sqrt(level) * 100;
}
exports.requiredEXP = requiredEXP;
/**
 * Adds the number of EXP specified to the user.
 * @param user the User to add EXP to
 * @param exp the number of EXP to add
 * @returns information about the User's updated level and EXP
 */
function addEXP(user, exp) {
    return __awaiter(this, void 0, void 0, function* () {
        const userInfo = yield User_1.default.findByIdAndUpdate(user.id, {
            $inc: { exp },
        }, {
            upsert: true,
            new: true,
            setDefaultsOnInsert: true,
        });
        let xp = userInfo.exp;
        let level = userInfo.level;
        let needed = requiredEXP(level);
        let newInfo;
        while (xp >= needed) {
            level++;
            xp -= needed;
            newInfo = yield User_1.default.findByIdAndUpdate(user.id, {
                level,
                exp: xp,
                $inc: {
                    skillPoints: 1,
                },
            });
            needed = requiredEXP(level);
        }
        if (newInfo) {
            return {
                id: user.id,
                exp: newInfo.exp,
                level: newInfo.level,
            };
        }
        return {
            id: userInfo.id,
            exp: userInfo.exp,
            level: userInfo.level,
        };
    });
}
exports.addEXP = addEXP;
/**
 * Adds the specified amount of levels to the user.
 * @param user the user to add levels to
 * @param levels the number of levels to add
 * @returns information about the User's updated levels and EXP
 */
function addLevel(user, levels) {
    return __awaiter(this, void 0, void 0, function* () {
        const userInfo = yield User_1.default.findByIdAndUpdate(user.id, {
            $inc: {
                level: levels,
            },
        }, {
            upsert: true,
            new: true,
            setDefaultsOnInsert: true,
        });
        return {
            id: userInfo.id,
            exp: userInfo.exp,
            level: userInfo.level,
        };
    });
}
exports.addLevel = addLevel;
/**
 * Returns information about the User's level and EXP.
 * @param user the User to get level data for
 * @returns information about the User's level and EXP
 */
function getInfo(user) {
    return __awaiter(this, void 0, void 0, function* () {
        const userInfo = yield User_1.default.findById(user.id);
        return {
            id: userInfo.id,
            exp: userInfo.exp,
            level: userInfo.level,
        };
    });
}
exports.getInfo = getInfo;
/**
 * Sets level and EXP of a user.
 * @param info object with the information to set
 * @returns the same object given
 */
function setInfo(info) {
    return __awaiter(this, void 0, void 0, function* () {
        yield User_1.default.findByIdAndUpdate(info.id, Object.assign({}, info), {
            upsert: true,
            setDefaultsOnInsert: true,
        });
        return info;
    });
}
exports.setInfo = setInfo;
