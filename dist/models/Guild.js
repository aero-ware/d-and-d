"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const guild = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
    },
    icon: {
        type: String,
        default: "",
    },
    banned: {
        type: Array,
        default: [],
    },
    owner: {
        type: String,
        required: true,
    },
    elders: {
        type: Array,
        default: [],
    },
    members: {
        type: Array,
        default: [],
    },
});
const model = mongoose_1.default.model("guilds", guild);
exports.default = model;
