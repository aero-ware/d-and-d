import mongoose from "mongoose";
import { item } from "./Item";

export const user = new mongoose.Schema({
    id: {
        type: String,
        required: true,
    },
    balance: {
        type: Number,
        default: 0,
    },
    inventory: {
        type: [item],
        default: [],
    },
});

const model = mongoose.model("users", user);

export default model;
