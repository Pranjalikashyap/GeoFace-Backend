const mongoose = require("mongoose");

// MongoDB Atlas connection string
const Mongo_Url = "mongodb+srv://pranjalikashyap08_db_user:AJrIObkWSRTey7a5@geo-face-cluster.ptxstsz.mongodb.net/?appName=Geo-Face-Cluster";

const connectDB = async () => {
    try {
        await mongoose.connect(Mongo_Url); // no options needed in Mongoose v7+
        console.log("✅ Connected to MongoDB Atlas");
    } catch (err) {
        console.error("❌ MongoDB connection error:", err);
        process.exit(1);
    }
};

module.exports = connectDB;
