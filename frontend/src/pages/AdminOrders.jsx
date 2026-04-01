// src/pages/AdminOrders.jsx
import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { ThemeContext } from "../context/ThemeContext";

const statusColors = {
  Pending: "#facc15",
  Paid: "#22c55e",
  Delivered: "#3b82f6"
};

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const { theme } = useContext(ThemeContext);
  const isDark = theme === "dark";

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/orders/admin/all-orders")
      .then((res) => setOrders(res.data.data || []))
      .catch((err) => console.error(err));
  }, []);

  const handleStatusChange = async (orderId, status) => {
    try {
      const res = await axios.put(
        `http://localhost:5000/api/orders/admin/update/${orderId}`,
        { status }
      );

      const updatedOrder = res.data.data;

      setOrders((prev) =>
        prev.map((o) => (o._id === updatedOrder._id ? updatedOrder : o))
      );

      if (selectedOrder?._id === updatedOrder._id) {
        setSelectedOrder(updatedOrder);
      }
    } catch (err) {
      console.error(err);
    }
  };

  /* SAME STYLE AS USER DASHBOARD */
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
    <div
      style={{
        padding: "30px",
        minHeight: "100vh",
        background: isDark ? "#121212" : "#f5f5f5",
      }}
    >
      <h1 style={{ color: isDark ? "#fff" : "#000", marginBottom: "20px" }}>
        Admin Dashboard
      </h1>

      <h3 style={{ color: isDark ? "#ccc" : "#555", marginBottom: "30px" }}>
        Total Orders: {orders.length}
      </h3>

      {orders.length === 0 && <p>No orders found</p>}

      {orders.map((order) => (
        <div
          key={order._id}
          style={cardStyle}
          onMouseEnter={(e) =>
            (e.currentTarget.style.transform = "scale(1.02)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.transform = "scale(1)")
          }
        >
          <div>
            <p><strong>Order ID:</strong> {order._id}</p>

            <p>
              <strong>User:</strong> {order.userId?.name ?? "Unknown"} (
              {order.userId?.email ?? "N/A"})
            </p>

            <p>
              <strong>Status:</strong>{" "}
              <span style={statusStyle(order.status)}>
                {order.status}
              </span>
            </p>

            <p>
              <strong>Rating:</strong>{" "}
              {order.rating ? `⭐ ${order.rating} / 5` : "Not rated yet"}
            </p>
          </div>

          <div style={{ display: "flex", gap: "10px" }}>
            <button
              style={buttonStyle}
              onMouseEnter={(e) =>
                (e.target.style.transform = "scale(1.05)")
              }
              onMouseLeave={(e) =>
                (e.target.style.transform = "scale(1)")
              }
              onClick={() => setSelectedOrder(order)}
            >
              View
            </button>

            {order.status !== "Delivered" && (
              <button
                style={{ ...buttonStyle, backgroundColor: "#3b82f6" }}
                onClick={() =>
                  handleStatusChange(order._id, "Delivered")
                }
              >
                Deliver
              </button>
            )}
          </div>
        </div>
      ))}

      {/* MODAL */}
      {selectedOrder && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: isDark
              ? "rgba(0,0,0,0.8)"
              : "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              background: isDark ? "#1f1f1f" : "#fff",
              color: isDark ? "#fff" : "#000",
              padding: 25,
              borderRadius: 12,
              width: "500px",
              maxHeight: "80vh",
              overflowY: "auto",
              position: "relative",
            }}
          >
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
              ×
            </button>

            <h3>Order Details</h3>

            <p><strong>Order ID:</strong> {selectedOrder._id}</p>
            <p><strong>User:</strong> {selectedOrder.userId?.name}</p>
            <p><strong>Email:</strong> {selectedOrder.userId?.email}</p>
            <p><strong>Payment:</strong> {selectedOrder.paymentMethod}</p>

            <p>
              <strong>Status:</strong>{" "}
              <span style={statusStyle(selectedOrder.status)}>
                {selectedOrder.status}
              </span>
            </p>

            <p>
              <strong>Total:</strong> ₹
              {(selectedOrder.totalAmount ?? 0).toFixed(2)}
            </p>

            <h4>Items</h4>
            <ul>
              {selectedOrder.items?.map((item, i) => (
                <li key={i}>
                  {item.name} × {item.quantity}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;