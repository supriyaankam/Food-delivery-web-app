// src/components/Navbar.jsx

import { Link, useNavigate, useLocation } from "react-router-dom";
import { ShoppingCart, Bell, LayoutDashboard, Home, Sun, Moon } from "lucide-react";
import { useEffect, useState, useContext } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import { io } from "socket.io-client";
import { ThemeContext } from "../context/ThemeContext";

const socket = io("http://localhost:5000");

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const { theme, toggleTheme } = useContext(ThemeContext);

  const isAdmin = user?.isAdmin;
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  /* ================= LOAD USER ================= */
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("userInfo"));
    if (storedUser) setUser(storedUser);
  }, []);

  /* ================= JOIN SOCKET ROOM ================= */
  useEffect(() => {
    if (user?._id) {
      socket.emit("join-room", user._id);
    }
  }, [user]);

  /* ================= FETCH NOTIFICATIONS ================= */
  useEffect(() => {
    if (!user?._id) return;

    const fetchNotifications = async () => {
      try {
        let res;

        if (isAdmin) {
          res = await axios.get(
            `http://localhost:5000/api/admin/notifications/${user._id}`
          );
        } else {
          res = await axios.get(
            `http://localhost:5000/api/orders/notifications/${user._id}`
          );
        }

        setNotifications(res.data.data || []);
      } catch (error) {
        console.error("Notification error:", error);
      }
    };

    fetchNotifications();
  }, [user, isAdmin]);

  /* ================= SOCKET EVENTS ================= */
  useEffect(() => {
    if (!user) return;

    const newOrderHandler = (data) =>
      setNotifications((prev) => [...prev, data]);

    const ratingHandler = (data) =>
      setNotifications((prev) => [...prev, data]);

    const orderUpdateHandler = (data) =>
      setNotifications((prev) => [...prev, data]);

    if (isAdmin) {
      socket.on("newOrder", newOrderHandler);
      socket.on("newRating", ratingHandler);
    } else {
      socket.on("orderUpdate", orderUpdateHandler);
    }

    return () => {
      socket.off("newOrder", newOrderHandler);
      socket.off("newRating", ratingHandler);
      socket.off("orderUpdate", orderUpdateHandler);
    };
  }, [user, isAdmin]);

  /* ================= LOGOUT ================= */
  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    navigate("/login");
    window.location.reload();
  };

  /* ================= ORDER RATING ================= */
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

      Swal.fire("Thank you!", "Rating submitted ⭐", "success");
    } catch (error) {
      Swal.fire(
        "Error",
        error.response?.data?.message || "Rating failed",
        "error"
      );
    }
  };

  /* ================= ADMIN CLICK ================= */
  const handleAdminNotificationClick = (orderId) => {
    navigate(`/admin/dashboard?orderId=${orderId}`);
    setShowNotifications(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav style={navStyle}>
      <div style={menuStyle}>
        {/* HOME */}
        <Link to="/" style={navItemStyle(isActive("/"))}>
          <Home size={26} />
          <span>Home</span>
        </Link>

        {/* CART */}
        {!isAdmin && user && (
          <Link to="/cart" style={navItemStyle(isActive("/cart"))}>
            <ShoppingCart size={26} />
            <span>Cart</span>
          </Link>
        )}

        {/* COINS */}
        {!isAdmin && user && (
          <Link to="/coins" style={navItemStyle(isActive("/coins"))}>
            <span role="img" aria-label="coins" style={{ fontSize: "22px" }}>💰</span>
            <span>Coins</span>
          </Link>
        )}

        {/* NOTIFICATIONS */}
        {user && (
          <div style={navItemStyle(false)}>
            <div style={{ position: "relative" }}>
              <Bell
                size={26}
                style={{ cursor: "pointer" }}
                onClick={() => setShowNotifications(!showNotifications)}
              />

              {unreadCount > 0 && (
                <span style={notificationBadge}>{unreadCount}</span>
              )}
            </div>

            <span>Notifications</span>

            {showNotifications && (
              <div style={notificationDropdown}>
                {notifications.length === 0 ? (
                  <p style={{ padding: "10px" }}>No notifications</p>
                ) : (
                  notifications.map((n, i) => (
                    <div
                      key={i}
                      style={notificationItem}
                      onClick={() =>
                        isAdmin
                          ? handleAdminNotificationClick(n.orderId)
                          : n.message?.toLowerCase().includes("delivered") &&
                            handleRating(n.orderId)
                      }
                    >
                      <p>{n.message}</p>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}

        {/* ADMIN DASHBOARD */}
        {isAdmin && (
          <Link
            to="/admin/dashboard"
            style={navItemStyle(isActive("/admin/dashboard"))}
          >
            <LayoutDashboard size={26} />
            <span>Dashboard</span>
          </Link>
        )}
      </div>

      {/* RIGHT SIDE */}
      <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
        {/* DARK MODE */}
        <button onClick={toggleTheme} style={themeBtn}>
          {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
        </button>

        {!user ? (
          <Link to="/login" style={loginBtn}>
            Login
          </Link>
        ) : (
          <button onClick={logoutHandler} style={logoutBtn}>
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

/* ================= STYLES ================= */

const navStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  background: "#ff4d4d",
  padding: "12px 20px",
  color: "#fff",
};

const menuStyle = {
  display: "flex",
  alignItems: "center",
  gap: "40px",
};

const navItemStyle = (isActive) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  textDecoration: "none",
  color: "#fff",
  fontSize: "13px",
  borderBottom: isActive ? "3px solid #FF7300" : "3px solid transparent",
});

const themeBtn = {
  background: "transparent",
  border: "none",
  cursor: "pointer",
  color: "#fff",
};

const loginBtn = {
  color: "#fff",
  textDecoration: "none",
  fontWeight: "bold",
};

const logoutBtn = {
  background: "#ef4444",
  color: "#fff",
  border: "none",
  padding: "6px 12px",
  borderRadius: "5px",
  cursor: "pointer",
};

const notificationBadge = {
  position: "absolute",
  top: "-6px",
  right: "-8px",
  background: "red",
  color: "#fff",
  borderRadius: "50%",
  width: "18px",
  height: "18px",
  fontSize: "11px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const notificationDropdown = {
  position: "absolute",
  top: "50px",
  right: "0",
  width: "300px",
  background: "#fff",
  border: "1px solid #ddd",
  borderRadius: "8px",
  maxHeight: "300px",
  overflowY: "auto",
  zIndex: 100,
};

const notificationItem = {
  padding: "10px",
  borderBottom: "1px solid #eee",
  cursor: "pointer",
  color: "#000",
};