import Food from "../models/Food.js";
import fs from "fs";
import path from "path";

// ================= Add Food =================
export const addFood = async (req, res) => {
  try {
    const { name, price, category } = req.body;
    const image = req.file; // multer handles this

    if (!name || !price || !category || !image) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const newFood = await Food.create({
      name,
      price,
      category,
      image: `/uploads/${image.filename}`, // store path relative to server
      canteen: "Main Canteen", // single canteen
    });

    res.status(201).json({ success: true, data: newFood });
  } catch (err) {
    console.error("Add Food Error:", err.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ================= Delete Food =================
export const deleteFood = async (req, res) => {
  try {
    const { id } = req.params;

    const food = await Food.findById(id);
    if (!food) return res.status(404).json({ success: false, message: "Food not found" });

    // Delete image from uploads folder
    const imagePath = path.join(process.cwd(), "uploads", path.basename(food.image));
    if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);

    await Food.findByIdAndDelete(id);

    res.status(200).json({ success: true, message: "Food deleted successfully" });
  } catch (err) {
    console.error("Delete Food Error:", err.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ================= Get All Foods =================
export const getFoods = async (req, res) => {
  try {
    const foods = await Food.find().sort({ createdAt: -1 });
    res.status(200).json(foods);
  } catch (err) {
    console.error("Get Foods Error:", err.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};