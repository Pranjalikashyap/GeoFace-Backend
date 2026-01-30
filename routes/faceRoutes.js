const express = require("express");
const multer = require("multer");
const axios = require("axios");
const fs = require("fs");
const FormData = require("form-data");

const Face = require("../models/Face");
const Attendance = require("../models/Attendence");
const User = require("../models/User");

const router = express.Router();
const upload = multer({ dest: "uploads/" }); // save files to disk

// -------------------- Register Face --------------------
router.post("/register-face", upload.single("image"), async (req, res) => {
    try {
        const { userId } = req.body;

        if (!userId || !req.file) {
            return res.status(400).json({ message: "userId and image required" });
        }

        // Prepare file for Python API
        const formData = new FormData();
        formData.append("image", fs.createReadStream(req.file.path));

        // Call Python API to get encoding
        const pythonRes = await axios.post(
            "http://127.0.0.1:5001/encode-face",
            formData,
            { headers: formData.getHeaders() }
        );

        const { encoding } = pythonRes.data;

        // -------------------- Remove old encoding for this user --------------------
        await Face.deleteMany({ userId });

        // Save new face encoding
        const face = new Face({
            userId,
            faceImage: req.file.path, // local saved path
            faceEncoding: encoding
        });

        await face.save();

        res.json({ success: true, message: "Face registered successfully ✅" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

// -------------------- Match Face & Mark Attendance (user-specific) --------------------
router.post("/match-face", upload.single("image"), async (req, res) => {
    try {
        const { userId } = req.body;

        if (!userId || !req.file) {
            return res.status(400).json({ message: "userId and image required" });
        }

        // Prepare file for Python API
        const formData = new FormData();
        formData.append("image", fs.createReadStream(req.file.path));

        // Get encoding from Python API
        const pythonRes = await axios.post(
            "http://127.0.0.1:5001/encode-face",
            formData,
            { headers: formData.getHeaders() }
        );

        const newEncoding = pythonRes.data.encoding;

        // -------------------- Get only faces for this user --------------------
        const userFaces = await Face.find({ userId });

        if (!userFaces || userFaces.length === 0) {
            return res.json({ success: false, message: "No face registered for this user" });
        }

        let matchedFace = null;
        const threshold = 0.35; // strict matching threshold

        // Compare uploaded image with each face of this user
        for (let face of userFaces) {
            const distance = euclidean(face.faceEncoding, newEncoding);
            console.log(`Distance to user ${face.userId}:`, distance);
            if (distance < threshold) {
                matchedFace = face;
                break;
            }
        }

        if (!matchedFace) {
            return res.json({ success: false, message: "Face does not match this user" });
        }

        // -------------------- Mark attendance (once per day) --------------------
        const now = new Date();
        const date = now.toISOString().split("T")[0];
        const time = now.toTimeString().split(" ")[0];

        const existing = await Attendance.findOne({ userId, date });
        if (!existing) {
            await Attendance.create({ userId, date, time });
        }

        res.json({
            success: true,
            message: `Attendance marked for user ✅`,
            userId,
            time
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

// -------------------- Helper --------------------
function euclidean(a, b) {
    return Math.sqrt(a.reduce((sum, val, i) => sum + Math.pow(val - b[i], 2), 0));
}

module.exports = router;
