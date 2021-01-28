import mongoose from "mongoose";
import { item as itemSchema } from "./Item";

export const user = new mongoose.Schema({
    _id: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        default: "start",
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
        type: [itemSchema],
        default: [],
    },
    skillPoints: {
        type: Number,
        default: 0,
    },
    inventory: {
        type: [itemSchema],
        default: [],
    },
    health: {
        type: Number,
        default: 100,
    },
});

const model = mongoose.model("users", user);

export default model;
