// src/controllers/orderController.js
import Order from "../models/Order.js";
import Cart from "../models/Cart.js";
import User from "../models/User.js";

/* ================= Place Order ================= */
export const placeOrder = async (req, res) => {
  try {
    const { userId, paymentMethod } = req.body;

    // Get user
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Block admin from placing order
    if (user.isAdmin || user.name.toLowerCase() === "ramesh") {
      return res.status(403).json({ message: "Admins cannot place orders" });
    }

    // Get user cart
    const cart = await Cart.findOne({ userId });
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // Calculate total
    const totalAmount = cart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    // Create order
    const newOrder = await Order.create({
      userId,
      items: cart.items,
      totalAmount,
      paymentMethod,
      paymentStatus: paymentMethod ? "Paid" : "Pending",
      status: "Pending",
    });

    // Clear user cart
    await Cart.findOneAndDelete({ userId });

    res.status(201).json({ success: true, data: newOrder });
  } catch (err) {
    console.error("Place Order Error:", err.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/* ================= Get User Orders ================= */
export const getUserOrders = async (req, res) => {
  try {
    const { userId } = req.params;
    const orders = await Order.find({ userId }).sort({ createdAt: -1 });
    res.json({ success: true, data: orders });
  } catch (err) {
    console.error("Get User Orders Error:", err.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/* ================= Get All Orders (Admin) ================= */
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("userId", "name email") // include user info
      .sort({ createdAt: -1 });

    res.json({ success: true, data: orders });
  } catch (err) {
    console.error("Get All Orders Error:", err.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/* ================= Update Order Status (Admin) ================= */
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body; // e.g., "Paid" or "Delivered"

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.status = status;
    if (status === "Paid") order.paymentStatus = "Paid";

    await order.save();

    res.json({ success: true, data: order });
  } catch (err) {
    console.error("Update Order Status Error:", err.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};