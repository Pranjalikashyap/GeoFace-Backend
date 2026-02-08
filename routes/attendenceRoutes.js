const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const mongoose = require("mongoose");
const Attendance = require("../models/Attendence.js");

const Face = require("../models/Face.js");


// Multer setup
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = path.join(__dirname, "../uploads");
        if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath);
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "_" + file.originalname);
    },
});
const upload = multer({ storage: storage });

// Attendance mark route
router.post("/mark-attendance", upload.single("image"), async (req, res) => {
    try {
        const { userId } = req.body;
        if (!req.file) return res.status(400).json({ error: "Image required" });
        if (!userId) return res.status(400).json({ error: "userId required" });

        // For now, simulate face encoding (replace with Python API for real encoding)
        const newEncoding = Array.from({ length: 128 }, () => Math.random() * 0.2 - 0.1);

        // Fetch registered face
        const registeredFace = await Face.findOne({ userId: mongoose.Types.ObjectId(userId) });
        if (!registeredFace) return res.status(404).json({ error: "User face not registered" });

        // Compare encodings (simplified)
        const distance = registeredFace.faceEncoding.reduce(
            (acc, val, i) => acc + Math.pow(val - newEncoding[i], 2),
            0
        );
        const threshold = 0.6; // lower = stricter
        if (Math.sqrt(distance) > threshold)
            return res.status(400).json({ error: "Face does not match" });

        // Save attendance
        const attendance = new Attendance({ userId: mongoose.Types.ObjectId(userId) });
        await attendance.save();

        res.json({ success: true, message: "Attendance marked successfully" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

module.exports = router;
