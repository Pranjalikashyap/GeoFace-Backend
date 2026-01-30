const express = require("express");
const multer = require("multer");
const axios = require("axios");
const User = require("../models/User");

const router = express.Router();
const upload = multer();

router.post("/register", upload.single("image"), async (req, res) => {
    try {
        const { userId } = req.body;

        if (!userId || !req.file) {
            return res.status(400).json({ message: "userId and image required" });
        }

        const formData = new FormData();
        formData.append("image", req.file.buffer, req.file.originalname);

        const response = await axios.post(
            "http://localhost:5001/process-face",
            formData,
            { headers: formData.getHeaders() }
        );

        const encoding = response.data.encoding;

        await User.findByIdAndUpdate(userId, {
            faceEncoding: encoding
        });

        res.json({ message: "Face registered successfully ✅" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
