import mongoose from "mongoose";

const guild = new mongoose.Schema({
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

const model = mongoose.model("guilds", guild);

export default model;
