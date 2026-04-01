// src/components/NotificationBell.jsx

import { useState, useEffect, useRef } from "react";
import { Bell } from "lucide-react";
import Swal from "sweetalert2";
import axios from "axios";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

const NotificationBell = ({ user }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const dropdownRef = useRef();

  /* ================= Fetch Notifications + Socket ================= */
  useEffect(() => {
    if (!user?._id) return;

    socket.emit("join-room", user._id);

    const fetchNotifications = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/orders/notifications/${user._id}`
        );

        setNotifications(res.data.data || []);
      } catch (err) {
        console.error("Failed to fetch notifications:", err.message);
      }
    };

    fetchNotifications();

    const handleNewNotification = (notification) => {
      setNotifications((prev) => [notification, ...prev]);

      Swal.fire({
        icon: "info",
        title: "New Notification",
        text: notification.message,
        timer: 2500,
        showConfirmButton: false,
      });
    };

    socket.on("new-notification", handleNewNotification);

    return () => {
      socket.off("new-notification", handleNewNotification);
    };
  }, [user]);

  /* ================= Close dropdown when clicking outside ================= */
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  /* ================= STAR RATING ================= */
  const handleRating = async (orderId) => {
    let selectedRating = 0;

    const result = await Swal.fire({
      title: "Rate your order ⭐",
      html: `
        <div id="star-container" style="font-size:32px;text-align:center;cursor:pointer">
          <span data-value="1">☆</span>
          <span data-value="2">☆</span>
          <span data-value="3">☆</span>
          <span data-value="4">☆</span>
          <span data-value="5">☆</span>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: "Submit",
      didOpen: () => {
        const stars = document.querySelectorAll("#star-container span");

        stars.forEach((star) => {
          star.addEventListener("click", () => {
            selectedRating = star.dataset.value;

            stars.forEach((s, index) => {
              s.textContent = index < selectedRating ? "★" : "☆";
            });
          });
        });
      },
      preConfirm: () => {
        if (selectedRating === 0) {
          Swal.showValidationMessage("Please select rating");
        }
        return selectedRating;
      },
    });

    if (!result.isConfirmed) return;

    try {
      await axios.put(
        `http://localhost:5000/api/orders/${orderId}/rate`,
        { rating: Number(result.value) }
      );

      Swal.fire("Thank you!", "Your rating has been submitted ⭐", "success");

      const updated = notifications.map((n) =>
        n.orderId === orderId ? { ...n, isRead: true } : n
      );

      setNotifications(updated);
    } catch (err) {
      Swal.fire(
        "Error",
        err.response?.data?.message || "Failed to submit rating",
        "error"
      );
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div style={{ position: "relative", textAlign: "center" }} ref={dropdownRef}>
      
      {/* Notification Icon */}
      <Bell
        size={22}
        color="white"
        style={{ cursor: "pointer" }}
        onClick={() => setShowNotifications(!showNotifications)}
      />

      {/* Bold Notifications Text */}
      <div
        style={{
          fontSize: "13px",
          color: "white",
          marginTop: "4px",
          // fontWeight: "normal"
          textAlign: "center"
        }}
      >
        Notifications
      </div>

      {/* Badge */}
      {unreadCount > 0 && (
        <span style={notificationBadge}>{unreadCount}</span>
      )}

      {/* Dropdown */}
      {showNotifications && (
        <div style={notificationDropdown}>
          {notifications.length === 0 ? (
            <p style={emptyText}>No notifications</p>
          ) : (
            notifications.map((n, index) => (
              <div
                key={index}
                style={{
                  padding: "12px",
                  borderBottom: "1px solid #eee",
                  background: n.isRead ? "#f9f9f9" : "#eaf5ff",
                  cursor: n.isRead ? "default" : "pointer",
                  color: "#000",
                }}
                onClick={() => {
                  if (
                    !n.isRead &&
                    n.message.toLowerCase().includes("delivered")
                  ) {
                    handleRating(n.orderId);
                  }
                }}
              >
                <p style={messageText}>{n.message}</p>

                <small style={timeText}>
                  {n.createdAt
                    ? new Date(n.createdAt).toLocaleString()
                    : ""}
                </small>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;


/* ================= STYLES ================= */

const notificationBadge = {
  position: "absolute",
  top: -5,
  right: -5,
  background: "red",
  color: "#fff",
  borderRadius: "50%",
  width: "18px",
  height: "18px",
  fontSize: "11px",
  textAlign: "center",
  lineHeight: "18px",
};

const notificationDropdown = {
  position: "absolute",
  right: 0,
  top: "40px",
  width: "270px",
  maxHeight: "320px",
  overflowY: "auto",
  backgroundColor: "#ffffff",
  border: "1px solid #ddd",
  borderRadius: "10px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
  zIndex: 1000,
  color: "#000",
};

const messageText = {
  margin: 0,
  color: "#000",
  fontWeight: "500",
  fontSize: "14px",
};

const timeText = {
  color: "#555",
  fontSize: "12px",
};

const emptyText = {
  padding: "12px",
  color: "#000",
};