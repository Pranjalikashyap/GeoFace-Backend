const User = require("../models/User");
const bcrypt = require("bcryptjs");

// ================= REGISTER =================
const register = async (req, res) => {
    try {
        const { fullName, email, password, employeeId, department } = req.body;

        if (!fullName || !email || !password || !employeeId || !department) {
            return res.status(400).json({ message: "All fields required" });
        }

        const exists = await User.findOne({ email });
        if (exists) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashed = await bcrypt.hash(password, 10);

        const user = await User.create({
            fullName,
            email,
            password: hashed,
            employeeId,
            department   // 🔥 THIS WAS MISSING
        });

        res.status(201).json({
            message: "Registered successfully",
            userId: user._id
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};


// ================= LOGIN =================
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "All fields required" });
        }

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Invalid credentials" });

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(400).json({ message: "Invalid credentials" });

        res.json({
            message: "Login successful",
            userId: user._id
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { register, login };
