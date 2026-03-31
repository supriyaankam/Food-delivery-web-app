// routes/orderRoutes.js
import express from "express";
import Order from "../models/Order.js";
import User from "../models/User.js";
import CoinHistory from "../models/CoinHistory.js";

const router = express.Router();

const MIN_BILL_FOR_COINS = 400;
const COIN_RATE = 50; // 1 coin per ₹50
const COIN_VALUE = 5; // 1 coin = ₹5 discount

/* ================= Create Order ================= */
router.post("/", async (req, res) => {
  const {
    userId,
    items,
    totalAmount,
    paymentMethod,
    deliveryLocation,
    usedCoins = 0,
    couponCode = null,
  } = req.body;

  if (!userId || !items || !totalAmount || !paymentMethod || !deliveryLocation) {
    return res.status(400).json({
      success: false,
      message:
        "Missing required fields: userId, items, totalAmount, paymentMethod, deliveryLocation",
    });
  }

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    let finalAmount = totalAmount;

    /* ================= APPLY USED COINS ================= */
    let coinsUsed = 0;
    if (usedCoins > 0 && user.coins > 0) {
      coinsUsed = Math.min(usedCoins, user.coins);
      finalAmount -= coinsUsed * COIN_VALUE;
      user.coins -= coinsUsed;

      // Store used coins in CoinHistory (orderId will be updated later)
      await CoinHistory.create({
        userId,
        type: "used",
        coins: coinsUsed,
        orderId: null,
        message: `Used ${coinsUsed} coin(s) for this order`,
      });
    }

    /* ================= APPLY COUPON ================= */
    let appliedCoupon = null;
    if (couponCode && Array.isArray(user.coupons)) {
      const coupon = user.coupons.find(
        (c) => c.code === couponCode && !c.isUsed && new Date(c.expiry) > new Date()
      );
      if (!coupon)
        return res.status(400).json({ success: false, message: "Invalid or expired coupon" });

      finalAmount -= coupon.discount;
      coupon.isUsed = true;
      appliedCoupon = coupon.code;
    }

    /* ================= CALCULATE EARNED COINS ================= */
    let coinsEarned = 0;
    if (finalAmount >= MIN_BILL_FOR_COINS) {
      coinsEarned = Math.floor(finalAmount / COIN_RATE);
      user.coins += coinsEarned;
    }

    /* ================= SAVE USER ================= */
    await user.save();

    /* ================= CREATE ORDER ================= */
    const status = paymentMethod === "COD" ? "Pending" : "Paid";
    const order = await Order.create({
      userId,
      items,
      totalAmount,
      paymentMethod,
      deliveryLocation,
      status,
      usedCoins,
      usedCoupon: appliedCoupon,
      earnedCoins: coinsEarned,
    });

    /* ================= UPDATE COIN HISTORY WITH ORDER ID ================= */
    if (coinsUsed > 0) {
      await CoinHistory.updateMany(
        { userId, type: "used", orderId: null },
        { orderId: order._id }
      );
    }
    if (coinsEarned > 0) {
      await CoinHistory.create({
        userId,
        type: "earned",
        coins: coinsEarned,
        orderId: order._id,
        message: `Earned ${coinsEarned} coin(s) from this order`,
      });
    }

    /* ================= NOTIFY ADMINS ================= */
    const admins = await User.find({ isAdmin: true });
    const io = req.app.get("io");
    for (const admin of admins) {
      const notification = {
        orderId: order._id,
        message: "New order received. Please check the admin dashboard.",
        createdAt: new Date(),
        isRead: false,
      };
      admin.notifications = admin.notifications || [];
      admin.notifications.push(notification);
      await admin.save();
      io.to(admin._id.toString()).emit("new-notification", notification);
    }

    /* ================= NOTIFY USER ABOUT ORDER & COINS ================= */
    const userNotification = {
      orderId: order._id,
      message: `Order placed successfully! You earned ${coinsEarned} coin(s).`,
      createdAt: new Date(),
      isRead: false,
    };
    user.notifications = user.notifications || [];
    user.notifications.push(userNotification);
    await user.save();
    io.to(user._id.toString()).emit("new-notification", userNotification);

    res.status(201).json({
      success: true,
      order,
      coins: user.coins,
    });
  } catch (err) {
    console.error("Order creation error:", err.message);
    res.status(500).json({
      success: false,
      message: "Server error while creating order",
    });
  }
});

/* ================= GET USER ORDERS ================= */
router.get("/user/:userId", async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.json({ success: true, data: orders || [] });
  } catch (err) {
    console.error("Fetch user orders error:", err.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch user orders",
      data: [],
    });
  }
});

/* ================= GET ALL ORDERS (ADMIN) ================= */
router.get("/admin/all-orders", async (req, res) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .populate("userId", "name email");
    res.json({ success: true, data: orders || [] });
  } catch (err) {
    console.error("Fetch all orders error:", err.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch all orders",
      data: [],
    });
  }
});

/* ================= UPDATE ORDER STATUS (ADMIN) ================= */
router.put("/admin/update/:orderId", async (req, res) => {
  const { status } = req.body;
  if (!status || !["Pending", "Paid", "Delivered"].includes(status)) {
    return res.status(400).json({ success: false, message: "Invalid status" });
  }

  try {
    const order = await Order.findById(req.params.orderId).populate("userId", "name email");
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });

    order.status = status;
    await order.save();

    /* Notify User when Delivered */
    if (status === "Delivered") {
      const user = await User.findById(order.userId._id);
      if (user) {
        const notification = {
          orderId: order._id,
          message: "Your order has been delivered successfully. Please rate your order ⭐",
          createdAt: new Date(),
          isRead: false,
        };
        user.notifications = user.notifications || [];
        user.notifications.push(notification);
        await user.save();
        const io = req.app.get("io");
        io.to(user._id.toString()).emit("new-notification", notification);
      }
    }

    res.json({ success: true, data: order });
  } catch (err) {
    console.error("Update order status error:", err.message);
    res.status(500).json({ success: false, message: "Failed to update order status" });
  }
});

/* ================= RATE ORDER ================= */
router.put("/:orderId/rate", async (req, res) => {
  const { rating } = req.body;
  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({ success: false, message: "Rating must be 1-5" });
  }

  try {
    const order = await Order.findById(req.params.orderId);
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });
    if (order.status !== "Delivered") return res.status(400).json({ success: false, message: "Only delivered orders can be rated" });
    if (order.rating) return res.status(400).json({ success: false, message: "Order already rated" });

    order.rating = rating;
    await order.save();

    res.json({ success: true, message: "Rating submitted", data: order });
  } catch (err) {
    console.error("Rate order error:", err.message);
    res.status(500).json({ success: false, message: "Failed to submit rating" });
  }
});

/* ================= GET USER NOTIFICATIONS ================= */
router.get("/notifications/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    res.json({ success: true, data: user?.notifications || [] });
  } catch (err) {
    console.error("Fetch notifications error:", err.message);
    res.status(500).json({ success: false, message: "Failed to fetch notifications", data: [] });
  }
});

export default router;