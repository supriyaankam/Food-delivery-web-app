import React, { useEffect, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

const UserNotifications = ({ userId }) => {
  const [notifications, setNotifications] = useState([]);
  const [ratingMap, setRatingMap] = useState({});

  useEffect(() => {
    if (!userId) return;

    socket.emit("join-room", userId);

    const fetchNotifications = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/orders/notifications/${userId}`
        );
        setNotifications(res.data.data || []);
      } catch (err) {
        console.error("Fetch notifications error:", err);
      }
    };

    fetchNotifications();

    socket.on("new-notification", (notification) => {
      setNotifications((prev) => [notification, ...prev]);
    });

    return () => {
      socket.off("new-notification");
    };
  }, [userId]);

  /* ================= Submit Rating ================= */

  const submitRating = async (orderId) => {
    const rating = ratingMap[orderId];

    if (!rating) {
      alert("Please select a rating before submitting!");
      return;
    }

    try {
      await axios.put(
        `http://localhost:5000/api/orders/${orderId}/rate`,
        { rating }
      );

      alert("⭐ Rating submitted successfully!");

      const updated = notifications.map((n) =>
        n.orderId === orderId ? { ...n, isRead: true } : n
      );

      setNotifications(updated);

      setRatingMap((prev) => ({ ...prev, [orderId]: 0 }));
    } catch (err) {
      console.error("Submit rating error:", err);
      alert("Failed to submit rating");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Your Notifications & Ratings</h2>

      {notifications.length === 0 && <p>No notifications yet.</p>}

      {notifications.map((n, idx) => (
        <div
          key={idx}
          style={{
            border: "1px solid #ccc",
            borderRadius: 10,
            padding: 15,
            marginBottom: 15,
            background: n.isRead ? "#fafafa" : "#eaf5ff",
          }}
        >
          <p>
            <strong>Order ID:</strong> {n.orderId}
          </p>

          <p>{n.message}</p>

          <p>
            <strong>Date:</strong>{" "}
            {new Date(n.createdAt ?? n.date).toLocaleString()}
          </p>

          {/* Show rating only if delivered */}
          {n.message?.toLowerCase().includes("delivered") && (
            <div style={{ marginTop: 12 }}>
              <strong>Rate your order:</strong>

              <div style={{ marginTop: 5 }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    style={{
                      cursor: "pointer",
                      fontSize: 28,
                      color:
                        (ratingMap[n.orderId] ?? 0) >= star
                          ? "#facc15"
                          : "#d1d5db",
                      marginRight: 6,
                      transition: "0.2s",
                    }}
                    onClick={() =>
                      setRatingMap((prev) => ({
                        ...prev,
                        [n.orderId]: star,
                      }))
                    }
                  >
                    ★
                  </span>
                ))}
              </div>

              <button
                style={{
                  marginTop: 10,
                  padding: "6px 14px",
                  borderRadius: 6,
                  border: "none",
                  backgroundColor: "#2563eb",
                  color: "#fff",
                  cursor: "pointer",
                }}
                onClick={() => submitRating(n.orderId)}
              >
                Submit Rating
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default UserNotifications;