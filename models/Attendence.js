const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    date: {
        type: String, // e.g. 2026-01-23
        required: true
    },

    time: {
        type: String, // e.g. 10:15 AM
        required: true
    },

    status: {
        type: String,
        default: "Present"
    }

}, { timestamps: true });

module.exports = mongoose.model("Attendance", attendanceSchema);
