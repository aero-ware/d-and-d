import mongoose from "mongoose";

const enemy = new mongoose.Schema({
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
    health: {
        type: Number,
        default: 10,
    },
    fighting: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    }
});

export default mongoose.model('enemies', enemy);