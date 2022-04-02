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
exports.addBal = exports.getBal = void 0;
const User_1 = __importDefault(require("../models/User"));
/**
 * Returns the balance of the specificed user.
 * @param user the user to get the balance of
 */
function getBal(user) {
    return __awaiter(this, void 0, void 0, function* () {
        const { balance } = yield User_1.default.findById(user.id);
        return balance || 0;
    });
}
exports.getBal = getBal;
/**
 * Adds the given number of coins to the user. Provide a negative number to remove coins.
 * @param user the user to add balance to
 * @param coins the number of coins to add
 * @returns the new number of coins the user has
 */
function addBal(user, coins) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!Number.isInteger(coins))
            throw new TypeError("parameter 'coins' must be an integer.");
        const { balance } = yield User_1.default.findByIdAndUpdate(user.id, {
            _id: user.id,
            $inc: {
                balance: coins,
            },
        }, {
            new: true,
            setDefaultsOnInsert: true,
        });
        return balance;
    });
}
exports.addBal = addBal;
