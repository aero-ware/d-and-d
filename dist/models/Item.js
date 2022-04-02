"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.item = exports.types = exports.rarities = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
exports.rarities = ["common", "uncommon", "rare", "epic", "mythic", "legendary"];
exports.types = ["weapon", "armor", "tool", "crystal"];
exports.item = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    effect: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        emum: exports.types,
        required: true,
    },
    rarity: {
        type: String,
        enum: exports.rarities,
        required: true,
    },
    base: {
        type: Number,
        default: 0,
    },
});
const model = mongoose_1.default.model("items", exports.item);
exports.default = model;
