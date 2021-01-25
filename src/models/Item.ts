import mongoose from "mongoose";

export const rarities = ["common", "uncommon", "rare", "epic", "mythic", "legendary"];
export const types = ["weapon", "armor", "tool", "crystal"];

export const item = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        emum: types,
        required: true,
    },
    rarity: {
        type: String,
        enum: rarities,
        required: true,
    },
});

const model = mongoose.model("items", item);

export default model;
