import mongoose from "mongoose";

/* ================= Notification Schema ================= */
const notificationSchema = new mongoose.Schema({
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
  },
  message: {
    type: String,
    required: true, // ensure every notification has a message
    trim: true,
  },
  isRead: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

/* ================= Coupon Schema ================= */
const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    trim: true,
  },
  discount: {
    type: Number, // e.g., ₹50 off
    required: true,
    min: 0,
  },
  isUsed: {
    type: Boolean,
    default: false,
  },
  expiry: {
    type: Date,
    required: true,
  },
});

/* ================= User Schema ================= */
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    isAdmin: {
      type: Boolean,
      default: false,
    },

    // ⭐ Loyalty coins
    coins: {
      type: Number,
      default: 0,
      min: 0,
    },

    // ⭐ Coupons
    coupons: {
      type: [couponSchema],
      default: [],
    },

    // ⭐ Notifications for order updates
    notifications: {
      type: [notificationSchema],
      default: [],
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);