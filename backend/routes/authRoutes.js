// src/routes/authRoutes.js
import express from "express";
import { signup, login } from "../controllers/authController.js";
import User from "../models/User.js";
import CoinHistory from "../models/CoinHistory.js";

const router = express.Router();

// POST /api/auth/signup
router.post("/signup", signup);

// POST /api/auth/login
router.post("/login", login);

/* ================= USER COINS HISTORY ================= */
// GET /api/auth/:id/coins/history
router.get("/:id/coins/history", async (req, res) => {
  try {
    const userId = req.params.id;

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Fetch coin history
    const history = await CoinHistory.find({ userId }).sort({ date: -1 });

    res.json({ success: true, history });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;