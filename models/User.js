const mongoose = require("mongoose");
delete mongoose.models.User;

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true
    },

    employeeId: {
        type: String,
        unique: true,
        required: true
    },

    department: {
        type: String,
        required: true
    },

    isActive: {
        type: Boolean,
        default: true
    }

}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
