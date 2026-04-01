// routes/cartRoutes.js
import express from "express";
import Cart from "../models/Cart.js";

const router = express.Router();

// CLEAR CART
router.post("/clear", async (req, res) => {
  const { userId } = req.body;

  try {
    await Cart.findOneAndUpdate(
      { userId },
      { items: [] }
    );

    res.status(200).json({ message: "Cart cleared successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to clear cart" });
  }
});

export default router;