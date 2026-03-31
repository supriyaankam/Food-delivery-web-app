import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { ThemeContext } from "../context/ThemeContext"; // your theme context

const statusColors = {
  Pending: "#facc15",   // yellow
  Paid: "#22c55e",      // green
  Delivered: "#3b82f6"  // blue
};

const Dashboard = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null); // modal state

  const { theme } = useContext(ThemeContext);
  const isDark = theme === "dark";

  const user = JSON.parse(localStorage.getItem("userInfo"));
  const userId = user?._id;

  useEffect(() => {
    if (!userId) return;

    axios
      .get(`http://localhost:5000/api/orders/user/${userId}`)
      .then(res => setOrders(res.data.data || []))
      .catch(err => console.error("Order fetch error:", err));
  }, [userId]);

  if (!user) {
    return (
      <h2 style={{ textAlign: "center", marginTop: "40px", color: isDark ? "#fff" : "#000" }}>
        Please login to see your order history
      </h2>
    );
  }

  const cardStyle = {
    backgroundColor: isDark ? "#1f1f1f" : "#fafafa",
    color: isDark ? "#fff" : "#000",
    borderRadius: "12px",
    padding: "20px",
    marginBottom: "20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxShadow: isDark
      ? "0 4px 15px rgba(0,0,0,0.5)"
      : "0 4px 10px rgba(0,0,0,0.1)",
    transition: "all 0.3s ease",
  };

  const statusStyle = (status) => ({
    backgroundColor: statusColors[status] || "#6b7280",
    color: "#fff",
    padding: "4px 10px",
    borderRadius: "6px",
    fontWeight: "600",
    fontSize: "0.9rem",
  });

  const buttonStyle = {
    padding: "8px 16px",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    backgroundColor: isDark ? "#ff4d4d" : "#ff1a1a",
    color: "#fff",
    fontWeight: "bold",
    transition: "transform 0.2s ease",
  };

  return (
    <div style={{ padding: "30px", minHeight: "100vh", background: isDark ? "#121212" : "#f5f5f5" }}>
      <h1 style={{ color: isDark ? "#fff" : "#000", marginBottom: "10px" }}>
        {user.name}'s Dashboard
      </h1>
      <h3 style={{ color: isDark ? "#ccc" : "#555", marginBottom: "30px" }}>
        Total Orders Placed: {orders.length}
      </h3>

      {orders.length === 0 && <p>No orders placed yet.</p>}

      {orders.map(order => (
        <div
          key={order._id}
          style={cardStyle}
          onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.02)"}
          onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
        >
          <div>
            <p><strong>Order ID:</strong> {order._id}</p>
            <p>
              <strong>Status:</strong>{" "}
              <span style={statusStyle(order.status)}>
                {order.status}
              </span>
            </p>
          </div>

          <button
            style={buttonStyle}
            onMouseEnter={(e) => (e.target.style.transform = "scale(1.05)")}
            onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
            onClick={() => setSelectedOrder(order)}
          >
            View Details
          </button>
        </div>
      ))}

      {/* Modal */}
      {selectedOrder && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: isDark ? "rgba(0,0,0,0.8)" : "rgba(0,0,0,0.5)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1000,
        }}>
          <div style={{
            background: isDark ? "#1f1f1f" : "#fff",
            color: isDark ? "#fff" : "#000",
            padding: 25,
            borderRadius: 12,
            width: "500px",
            maxHeight: "80vh",
            overflowY: "auto",
            position: "relative",
            boxShadow: isDark
              ? "0 8px 20px rgba(0,0,0,0.6)"
              : "0 8px 20px rgba(0,0,0,0.2)",
          }}>
            <h3>Order Details</h3>
            <button
              onClick={() => setSelectedOrder(null)}
              style={{
                position: "absolute",
                top: 10,
                right: 10,
                border: "none",
                background: "transparent",
                fontSize: 24,
                cursor: "pointer",
                color: isDark ? "#fff" : "#000",
              }}
            >
              &times;
            </button>

            <p><strong>Order ID:</strong> {selectedOrder._id}</p>
            <p><strong>Payment Method:</strong> {selectedOrder.paymentMethod}</p>
            <p>
              <strong>Status:</strong>{" "}
              <span style={statusStyle(selectedOrder.status)}>
                {selectedOrder.status}
              </span>
            </p>
            <p><strong>Total Amount:</strong> ₹{selectedOrder.totalAmount.toFixed(2)}</p>
            <p><strong>Ordered At:</strong> {new Date(selectedOrder.createdAt).toLocaleString()}</p>

            <h4>Items Ordered:</h4>
            <ul>
              {selectedOrder.items && selectedOrder.items.length > 0 ? (
                selectedOrder.items.map((item, idx) => (
                  <li key={idx}>
                    {item.name} (Qty: {item.quantity}) - ₹{(item.price * item.quantity).toFixed(2)}
                  </li>
                ))
              ) : (
                <li>No items found in this order.</li>
              )}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;