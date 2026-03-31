import express from "express";
import Canteen from "../models/Canteen.js";

const router = express.Router();

// GET all canteens
router.get("/", async (req, res) => {
  try {
    const canteens = await Canteen.find(); // Fetch all
    res.status(200).json(canteens);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching canteens" });
  }
});

export default router;