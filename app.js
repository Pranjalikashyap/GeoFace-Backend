require("dotenv").config(); 

const express = require("express");
const connectDB = require("./config/db");


const authRoutes = require("./routes/authRoutes");
const faceRoutes = require("./routes/faceRoutes");
const attendanceRoutes = require("./routes/attendenceRoutes");

const app = express();

// Connect MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// Test route
app.get("/", (req, res) => {
    res.send("🚀 Geo Face API Running Successfully");
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/face", faceRoutes);
app.use("/api/attendance", attendanceRoutes);

// Port from Render
const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
});
