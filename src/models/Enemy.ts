import mongoose from "mongoose";

const enemy = new mongoose.Schema({
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
    },
});

export default mongoose.model("enemies", enemy);
