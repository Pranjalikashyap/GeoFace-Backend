const mongoose = require("mongoose");

const Mongo_Url = process.env.MONGO_URI; // don't use localhost fallback for deployment

const connectDB = async () => {
    try {
        await mongoose.connect(Mongo_Url);
        console.log("✅ Connected to MongoDB Atlas");
    } catch (err) {
        console.log("❌ MongoDB connection error:", err);
        process.exit(1);
    }
};

module.exports = connectDB;
