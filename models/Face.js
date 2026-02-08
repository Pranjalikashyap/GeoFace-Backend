const mongoose = require("mongoose");

const faceSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    faceImage: {
        type: String,
        required: true
    },
    faceEncoding: {
        type: [Number],
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model("Face", faceSchema);


