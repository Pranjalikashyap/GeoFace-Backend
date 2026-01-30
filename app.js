const express = require("express");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const faceRoutes = require("./routes/faceRoutes");
const attendanceRoutes = require("./routes/attendenceRoutes");
const mongoose = require("mongoose");





const app = express();
connectDB();

app.use(express.json());
app.use("/uploads", express.static("uploads"));


app.get("/", (req, res) => res.send("Face Registration API Running"));

app.use("/api/auth", authRoutes);
app.use("/api/face", faceRoutes);
app.use("/api/attendance", attendanceRoutes);



const PORT = 8080;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

