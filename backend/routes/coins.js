// routes/coins.js
import express from "express";
import User from "../models/User.js";
import CoinHistory from "../models/CoinHistory.js";
import Order from "../models/Order.js"; // optional, only to populate order info

const router = express.Router();

/* ================= GET USER COINS ================= */
router.get("/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    res.json({ success: true, coins: user.coins || 0 });
  } catch (err) {
    console.error("Error fetching coins:", err);
    res
      .status(500)
      .json({ success: false, message: "Server error fetching coins" });
  }
});

/* ================= GET USER COIN HISTORY ================= */
router.get("/:userId/history", async (req, res) => {
  try {
    const { userId } = req.params;

    // ✅ Fetch coin history for user, populate orderId safely
    const history = await CoinHistory.find({ userId })
      .populate("orderId", "_id totalAmount status createdAt") // populate only necessary fields
      .sort({ createdAt: -1 }); // latest first

    // ✅ Map to clean response format
    const formattedHistory = history.map((item) => ({
      orderId: item.orderId ? item.orderId._id : null,
      coins: item.coins,
      type: item.type,
      message: item.message || "",
      createdAt: item.createdAt,
    }));

    res.json({ success: true, history: formattedHistory });
  } catch (err) {
    console.error("Error fetching coin history:", err);
    res
      .status(500)
      .json({ success: false, message: "Server error fetching coin history" });
  }
});

export default router;