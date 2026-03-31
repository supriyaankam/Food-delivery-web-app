// routes/coupons.js
import express from "express";
import Coupon from "../models/Coupon.js"; // Mongoose model for coupons

const router = express.Router();

// Validate coupon
router.post("/validate", async (req, res) => {
  try {
    const { code, totalAmount } = req.body;
    const coupon = await Coupon.findOne({ code: code.toUpperCase() });

    if (!coupon) return res.status(404).json({ success: false, message: "Invalid coupon" });

    if (coupon.expiryDate < new Date())
      return res.status(400).json({ success: false, message: "Coupon expired" });

    if (totalAmount < coupon.minAmount)
      return res.status(400).json({ success: false, message: `Minimum order ₹${coupon.minAmount}` });

    let discount = 0;
    if (coupon.type === "percentage") discount = (totalAmount * coupon.value) / 100;
    else discount = coupon.value;

    res.json({ success: true, discount, message: `Coupon applied! You got ₹${discount} off` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;