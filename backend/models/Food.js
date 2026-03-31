// models/Food.js
import mongoose from "mongoose";

const foodSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true },
    image: { type: String, default: "" }, // optional image path/URL
    category: { type: String, required: true, trim: true },
    canteen: { type: mongoose.Schema.Types.ObjectId, ref: "Canteen", required: false },
    isAvailable: { type: Boolean, default: true },

    // ⭐ New rating fields
    rating: { type: Number, default: 0 }, // average rating (0-5)
    numReviews: { type: Number, default: 0 } // total number of reviews
  },
  { timestamps: true } // adds createdAt and updatedAt automatically
);

export default mongoose.model("Food", foodSchema);