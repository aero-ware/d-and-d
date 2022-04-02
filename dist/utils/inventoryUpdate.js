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
exports.addInventoryItem = void 0;
const User_1 = __importDefault(require("../models/User"));
/**
 * Adds an item to a user's inventory, if it is not full.
 * @param user the user to add the item to
 * @param item the item to add
 * @returns whether or not the operation was succesful
 */
function addInventoryItem(user, item) {
    return __awaiter(this, void 0, void 0, function* () {
        const { inventory } = yield User_1.default.findById(user.id);
        if (inventory.length >= 36)
            return false;
        yield User_1.default.findByIdAndUpdate(user.id, {
            _id: user.id,
            $push: {
                inventory: item,
            },
        });
        return true;
    });
}
exports.addInventoryItem = addInventoryItem;
