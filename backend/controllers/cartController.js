import Cart from "../models/Cart.js";
import User from "../models/User.js";

/* ================= Add item to cart ================= */
export const addToCart = async (req, res) => {
  const { userId, foodId, name, price, quantity } = req.body;

  // Check if user is admin
  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ message: "User not found" });

  if (user.isAdmin || user.name.toLowerCase() === "ramesh") {
    return res.status(403).json({ message: "Admins cannot use cart" });
  }

  let cart = await Cart.findOne({ userId });

  if (!cart) {
    cart = await Cart.create({
      userId,
      items: [{ foodId, name, price, quantity }]
    });
  } else {
    const itemIndex = cart.items.findIndex(
      item => item.foodId.toString() === foodId.toString()
    );

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({ foodId, name, price, quantity });
    }

    await cart.save();
  }

  res.json(cart);
};

/* ================= Get user cart ================= */
export const getCart = async (req, res) => {
  const { userId } = req.params;

  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ message: "User not found" });

  if (user.isAdmin || user.name.toLowerCase() === "ramesh") {
    return res.status(403).json({ message: "Admins cannot use cart" });
  }

  const cart = await Cart.findOne({ userId });
  res.json(cart || { items: [] });
};

/* ================= Remove item from cart ================= */
export const removeFromCart = async (req, res) => {
  const { userId, foodId } = req.body;

  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ message: "User not found" });

  if (user.isAdmin || user.name.toLowerCase() === "ramesh") {
    return res.status(403).json({ message: "Admins cannot use cart" });
  }

  const cart = await Cart.findOne({ userId });
  if (!cart) return res.status(404).json({ message: "Cart not found" });

  cart.items = cart.items.filter(
    item => item.foodId.toString() !== foodId.toString()
  );

  await cart.save();
  res.json(cart);
};

/* ================= Clear entire cart ================= */
export const clearCart = async (req, res) => {
  const { userId } = req.params;

  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ message: "User not found" });

  if (user.isAdmin || user.name.toLowerCase() === "ramesh") {
    return res.status(403).json({ message: "Admins cannot use cart" });
  }

  await Cart.findOneAndDelete({ userId });
  res.json({ message: "Cart cleared" });
};