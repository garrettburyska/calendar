import express from "express";
import db from "../db/connection.js";
import { ObjectId } from "mongodb";
import bcrypt from "bcrypt";
const router = express.Router();

// check session
router.get("/check-session", (req, res) => {
  if (req.session.user) {
    res.json({ loggedIn: true, user: req.session.user });
  } else {
    res.json({ loggedIn: false });
  }
});

// login
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const users = db.collection("users");

        // check email
        const user = await users.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // create session
        req.session.user = user._id;
        res.json({ message: "Logged in successfully" });
        
    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ message: "Server error" });
    }
});

// logout
router.post("/logout", (req, res) => {
    req.session.destroy(() => {
        res.clearCookie("connect.sid");
        res.json({ message: "Logged out" });
    });
});

export default router;