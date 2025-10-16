import express from "express";
import db from "../db/connection.js";
import bcrypt from "bcrypt";
import requireLogin from "../middleware/auth.js";

const router = express.Router();

// Check session
router.get("/check-session", async (req, res) => {
  try {
    if (!req.session.user) {
      return res.json({ loggedIn: false });
    }
    return res.json({ loggedIn: true, user: req.session.user });
  } catch (err) {
    console.error("Check session error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const users = db.collection("users");

    const user = await users.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    req.session.user = user._id;
    return res.json({ message: "Logged in successfully" });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Logout
router.post("/logout", requireLogin, async (req, res) => {
  try {
    req.session.destroy(() => {
      res.clearCookie("connect.sid");
      res.json({ message: "Logged out successfully" });
    });
  } catch (err) {
    console.error("Logout error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Validation functions
const validateEmail = e => /\S+@\S+\.\S+/.test(e);
const validatePassword = p => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/.test(p);

// Create account
router.post("/create-account", async (req, res) => {
  try {
    const { email, password, name } = req.body;
    const users = db.collection("users");

    const existingUser = await users.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists." });
    }

    if (!name) {
      return res.status(400).json({ message: "Please enter a name." });
    } else if (!validateEmail(email)) {
      return res.status(400).json({ message: "Please enter a valid email." });
    } else if (!validatePassword(password)) {
      return res.status(400).json({
        message:
          "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await users.insertOne({ email, password: hashedPassword, name });

    return res.json({ message: "User created successfully!" });
  } catch (err) {
    console.error("Create account error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;