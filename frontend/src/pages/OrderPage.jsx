// src/pages/OrderPage.jsx

import React, { useState } from "react";
import OTPModal from "../components/OTPModal";
import axios from "axios";

const OrderPage = ({ userId }) => {
  const [orderId, setOrderId] = useState(null);
  const [showOTP, setShowOTP] = useState(false);
  const [loading, setLoading] = useState(false);

  // Example cart items and total amount (replace with actual cart data)
  const cartItems = [
    { itemId: "ITEM_1", name: "Burger", quantity: 2, price: 100 },
  ];
  const totalAmount = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Place order API call
  const placeOrder = async () => {
    try {
      setLoading(true);

      const res = await axios.post("http://localhost:5000/api/orders/", {
        userId,
        items: cartItems.map(({ itemId, quantity }) => ({ itemId, quantity })),
        totalAmount,
        paymentMethod: "Online", // Can also be "COD"
        deliveryLocation: "Some Address", // Replace with actual delivery location
      });

      const newOrder = res.data.data;
      setOrderId(newOrder._id);

      if (newOrder.paymentMethod !== "COD") {
        setShowOTP(true); // show OTP modal
      } else {
        alert("Order placed successfully with Cash on Delivery!");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Callback when OTP is successfully verified
  const handleOTPSuccess = (updatedOrder) => {
    setShowOTP(false);
    alert(`Payment Successful! Order ID: ${updatedOrder._id}`);
    // TODO: Optionally redirect to user orders page or clear cart
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Place Your Order</h1>

      <div style={{ marginBottom: "1rem" }}>
        <h3>Cart Items:</h3>
        {cartItems.map((item) => (
          <p key={item.itemId}>
            {item.name} x {item.quantity} = ₹{item.price * item.quantity}
          </p>
        ))}
        <p>
          <strong>Total: ₹{totalAmount}</strong>
        </p>
      </div>

      <button
        onClick={placeOrder}
        disabled={loading}
        style={{
          padding: "0.6rem 1.2rem",
          cursor: loading ? "not-allowed" : "pointer",
          background: "#ff4d4d",
          color: "#fff",
          border: "none",
          borderRadius: "6px",
          fontWeight: "bold",
        }}
      >
        {loading ? "Placing Order..." : "Place Online Order"}
      </button>

      {showOTP && orderId && (
        <OTPModal
          orderId={orderId}
          userId={userId}
          onSuccess={handleOTPSuccess}
          onClose={() => setShowOTP(false)}
        />
      )}
    </div>
  );
};

export default OrderPage;