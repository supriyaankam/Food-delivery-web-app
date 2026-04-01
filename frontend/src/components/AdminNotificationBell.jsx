// src/components/AdminNotificationBell.jsx

import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";

const socket = io("http://localhost:5000");

const AdminNotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Listen for new orders or ratings
    socket.on("newOrder", (data) => {
      setNotifications((prev) => [...prev, data]);
    });

    socket.on("newRating", (data) => {
      setNotifications((prev) => [...prev, data]);
    });

    // Cleanup socket listeners on unmount
    return () => {
      socket.off("newOrder");
      socket.off("newRating");
    };
  }, []);

  const handleClick = (orderId) => {
    // Mark notification as read if needed (optional)
    // Navigate to dashboard with orderId
    navigate(`/admin/dashboard?orderId=${orderId}`);
    setShowDropdown(false);
  };

  return (
    <div className="relative">
      {/* Bell icon */}
      <Bell
        size={24}
        className="cursor-pointer"
        onClick={() => setShowDropdown(!showDropdown)}
      />

      {/* Badge */}
      {notifications.length > 0 && (
        <span className="badge absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
          {notifications.length}
        </span>
      )}

      {/* Dropdown */}
      {showDropdown && (
        <div className="dropdown absolute right-0 mt-2 w-64 bg-white border border-gray-300 rounded shadow-lg z-50 max-h-64 overflow-y-auto">
          {notifications.length === 0 ? (
            <p className="p-2 text-gray-700">No notifications</p>
          ) : (
            notifications.map((n, i) => (
              <div
                key={i}
                className="p-2 border-b border-gray-200 cursor-pointer hover:bg-gray-100"
                onClick={() => handleClick(n.orderId)}
              >
                <p className="text-gray-800 mb-1">{n.message}</p>
                {n.userEmail && (
                  <small className="text-gray-500 block">User: {n.userEmail}</small>
                )}
                {n.rating && (
                  <small className="text-gray-500 block">Rating: {n.rating} ⭐</small>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default AdminNotificationBell;