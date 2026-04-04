// routes/foodRoutes.js
import express from "express";
import Food from "../models/Food.js";
// import Canteen from "../models/Canteen.js";
import authMiddleware from "../middleware/auth.js"; // make sure you have this

const router = express.Router();

// GET all foods (users/admin)
router.get("/", async (req, res) => {
  try {
    const foods = await Food.find()
      .populate("canteen", "name image location")
      .sort({ createdAt: -1 }); // latest first
    res.json({ success: true, data: foods });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST add new food (admin only)
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { name, price, category, canteen, image } = req.body;

    if (!name || !price || !category) {
      return res.status(400).json({ success: false, message: "Required fields missing" });
    }

    const newFood = new Food({
      name,
      price,
      category,
      canteen,
      image: image || ""
    });

    await newFood.save();
    res.json({ success: true, food: newFood });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT update food by id (admin only)
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const updatedFood = await Food.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedFood) return res.status(404).json({ success: false, message: "Food not found" });
    res.json({ success: true, food: updatedFood });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE food by id (admin only)
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const deletedFood = await Food.findByIdAndDelete(req.params.id);
    if (!deletedFood) return res.status(404).json({ success: false, message: "Food not found" });
    res.json({ success: true, message: "Food deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
