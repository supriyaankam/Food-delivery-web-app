import express from "express";
import Food from "../models/Food.js"; // updated to Food.js

const router = express.Router();

// ADD food (Admin)
router.post("/add-food", async (req, res) => {
  try {
    const food = new Food(req.body);
    await food.save();
    res.json({ message: "Food added successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error adding food", error });
  }
});

// GET foods (Home page)
router.get("/foods", async (req, res) => {
  try {
    const foods = await Food.find();
    res.json(foods);
  } catch (error) {
    res.status(500).json({ message: "Error fetching foods", error });
  }
});

export default router;