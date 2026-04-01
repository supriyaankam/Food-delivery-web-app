// models/CoinHistory.js
import mongoose from "mongoose";

const coinHistorySchema = new mongoose.Schema(
  {
    // ✅ Reference to the user who earned/used coins
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // ✅ Reference to the related order (if applicable)
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      default: null,
    },

    // ✅ Transaction type: earned or used
    type: {
      type: String,
      enum: ["earned", "used"],
      required: true,
    },

    // ✅ Number of coins earned or used
    coins: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },

    // ✅ Optional message for UI
    message: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true, // automatically adds createdAt and updatedAt
  }
);

// Optional: create index for faster queries
coinHistorySchema.index({ userId: 1, createdAt: -1 });

const CoinHistory = mongoose.model("CoinHistory", coinHistorySchema);

export default CoinHistory;