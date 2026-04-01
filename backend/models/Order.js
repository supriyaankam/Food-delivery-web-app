// models/Order.js
import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: [true, "User ID is required"] 
    },

    items: [
      {
        _id: { type: String, required: [true, "Item ID is required"] },
        name: { type: String, required: [true, "Item name is required"], trim: true },
        price: { type: Number, required: [true, "Item price is required"] },
        quantity: { type: Number, required: [true, "Item quantity is required"] },
        image: { type: String, required: [true, "Item image is required"], trim: true },
      },
    ],

    totalAmount: { 
      type: Number, 
      required: [true, "Total amount is required"] 
    },

    paymentMethod: { 
      type: String, 
      enum: {
        values: ["COD", "GooglePay", "PhonePe"],
        message: "Payment method must be COD, GooglePay, or PhonePe"
      },
      required: [true, "Payment method is required"] 
    },

    deliveryLocation: { 
      type: String, 
      required: [true, "Delivery location is required"],
      enum: {
        values: [
          "Ratan Tata Bhavan",
          "KL Rao Bhavan",
          "Bill Gates Bhavan",
          "Bhaskar Bhavan",
          "Girls Hostel",
          "Boys Hostel",
          "Ramanujan Bhavan"
        ],
        message: "Delivery location must be one of the campus locations"
      },
      trim: true
    },

    status: { 
      type: String, 
      enum: ["Pending", "Paid", "Delivered"], 
      default: "Pending" 
    },

    rating: { 
      type: Number, 
      min: [1, "Rating must be at least 1"], 
      max: [5, "Rating cannot be more than 5"],
      default: null
    },

    review: {
      type: String,
      default: "",
      trim: true
    },

    notifications: [
      {
        message: { type: String, required: [true, "Notification message is required"], trim: true },
        date: { type: Date, default: Date.now },
        read: { type: Boolean, default: false },
      },
    ],

    adminNotified: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;