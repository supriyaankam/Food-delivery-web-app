// src/pages/PaymentSuccess.jsx
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const PaymentSuccess = () => {
  const [totalAmount, setTotalAmount] = useState(0);
  const navigate = useNavigate();

  // Load total amount from localStorage if needed
  useEffect(() => {
    const storedTotal = parseFloat(localStorage.getItem("grandTotal") || 0);
    setTotalAmount(storedTotal);

    // Automatically redirect to Home after 3 seconds
    const timer = setTimeout(() => {
      navigate("/"); // Redirect to Home page
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>🎉 Payment Successful!</h1>
      <p style={styles.text}>
        Your order has been placed successfully.
      </p>

      {totalAmount > 0 && (
        <p style={styles.text}>Total Paid: ₹{totalAmount.toFixed(2)}</p>
      )}

      <p style={{ marginTop: "15px", fontSize: "14px", color: "#555" }}>
        Redirecting to Home page...
      </p>

      <Link to="/" style={styles.homeBtn}>
        Go to Home Now
      </Link>
    </div>
  );
};

export default PaymentSuccess;

/* ================= STYLES ================= */
const styles = {
  container: {
    maxWidth: "500px",
    margin: "100px auto",
    textAlign: "center",
    padding: "30px",
    border: "1px solid #ddd",
    borderRadius: "12px",
    boxShadow: "0 0 15px rgba(0,0,0,0.2)",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: "28px",
    color: "#28a745",
    marginBottom: "20px",
  },
  text: {
    fontSize: "18px",
    marginBottom: "15px",
  },
  homeBtn: {
    display: "inline-block",
    padding: "12px 25px",
    backgroundColor: "#ff4d4d",
    color: "#fff",
    borderRadius: "8px",
    textDecoration: "none",
    fontWeight: "bold",
    marginTop: "20px",
    transition: "0.2s",
  },
};