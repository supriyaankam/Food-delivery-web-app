// src/pages/LandingPage.jsx

import { useNavigate } from "react-router-dom";
import bgFood from "../assets/bg-food.jpg";
import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

const LandingPage = () => {
  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext);

  const isDark = theme === "dark";

  /* ================= FIXED COLORS ================= */

  // ✅ Slight overlay in BOTH modes
  const overlayColor = isDark
    ? "rgba(0,0,0,0.65)"     // dark mode
    : "rgba(0,0,0,0.25)";    // light mode (important fix)

  // ✅ Text color based on theme
  const textColor = "#ffffff"; // always white for visibility

  // ✅ Button color
  const buttonBg = isDark ? "#111827" : "#ff4d4d";

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        backgroundImage: `url(${bgFood})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
      }}
    >
      {/* ✅ OVERLAY FIX */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: overlayColor,
        }}
      ></div>

      {/* ✅ CONTENT */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          textAlign: "center",
          padding: "40px",
        }}
      >
        <h1
          style={{
            color: textColor,
            fontSize: "3.5rem",
            fontWeight: "bold",
            textShadow: "0 4px 20px rgba(0,0,0,0.9)", // stronger shadow
          }}
        >
          Welcome to FoodieHub 🍔
        </h1>

        <p
          style={{
            color: textColor,
            fontSize: "1.5rem",
            marginTop: "10px",
            textShadow: "0 3px 15px rgba(0,0,0,0.9)", // improved visibility
          }}
        >
          Delicious food delivered right to your doorstep!
        </p>

        <button
          onClick={() => navigate("/home")}
          style={{
            marginTop: "20px",
            padding: "14px 32px",
            border: "none",
            borderRadius: "10px",
            background: buttonBg,
            color: "#fff",
            fontWeight: "bold",
            cursor: "pointer",
            boxShadow: isDark
              ? "0 6px 20px rgba(0,0,0,0.6)"
              : "0 6px 20px rgba(255,77,77,0.4)",
          }}
        >
          Explore Menu
        </button>
      </div>
    </div>
  );
};

export default LandingPage;