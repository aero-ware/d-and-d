import mongoose from "mongoose";
import { item as itemSchema } from "./Item";

export const user = new mongoose.Schema({
    id: {
        type: String,
        required: true,
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
    inventory: {
        type: [itemSchema],
        default: [],
    },
});

const model = mongoose.model("users", user);

export default model;
