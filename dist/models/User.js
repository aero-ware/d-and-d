"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.user = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Item_1 = require("./Item");
exports.user = new mongoose_1.default.Schema({
    _id: {
        type: String,
        required: true,
    },
    prestige: {
        type: Number,
        default: 0,
    },
    location: {
        type: String,
        default: "start",
    },
    didWin: {
        type: Boolean,
        default: false,
    },
    exp: {
        type: Number,
        default: 0,
    },
    level: {
        type: Number,
        default: 0,
    },
    mana: {
        type: Number,
        default: 0,
    },
    strength: {
        type: Number,
        default: 0,
    },
    speed: {
        type: Number,
        default: 0,
    },
    intelligence: {
        type: Number,
        default: 0,
    },
    balance: {
        type: Number,
        default: 0,
    },
    hotbar: {
        type: [Item_1.item],
        default: [],
    },
    skillPoints: {
        type: Number,
        default: 0,
    },
    inventory: {
        type: [Item_1.item],
        default: [],
    },
    health: {
        type: Number,
        default: 100,
    },
});
const model = mongoose_1.default.model("users", exports.user);
exports.default = model;
