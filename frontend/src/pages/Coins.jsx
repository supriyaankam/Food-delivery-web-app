// src/pages/Coins.jsx
import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";
import { UserContext } from "../context/UserContext";

const BACKEND_URL = "http://localhost:5000";

const Coins = () => {
  const navigate = useNavigate();
  const { user: contextUser } = useContext(UserContext);

  const [totalCoins, setTotalCoins] = useState(0);
  const [coinsToUse, setCoinsToUse] = useState(0);
  const [remainingCoins, setRemainingCoins] = useState(0);
  const [coinHistory, setCoinHistory] = useState([]);

  const currentUser =
    contextUser || JSON.parse(localStorage.getItem("userInfo") || "{}");

  /* ================= LOAD DATA ================= */
  useEffect(() => {
    if (!currentUser || !currentUser._id) {
      Swal.fire("Login Required", "Please login first", "warning");
      navigate("/login");
      return;
    }

    const fetchCoins = async () => {
      try {
        // ✅ Get total coins
        const res = await axios.get(
          `${BACKEND_URL}/api/coins/${currentUser._id}`
        );
        const coins = Number(res.data.coins || 0);
        setTotalCoins(coins);

        // ✅ Load coins to use from localStorage
        const used = Number(localStorage.getItem("coinsToUse") || 0);
        const safeUsed = Math.min(used, coins);
        setCoinsToUse(safeUsed);
        setRemainingCoins(coins - safeUsed);

        // ✅ Fetch coin history
        const historyRes = await axios.get(
          `${BACKEND_URL}/api/coins/${currentUser._id}/history`
        );
        setCoinHistory(historyRes.data.history || []);
      } catch (err) {
        console.error(err);
        Swal.fire("Error", "Failed to fetch coins", "error");
      }
    };

    fetchCoins();
  }, [currentUser, navigate]);

  /* ================= LIVE UPDATE REMAINING COINS ================= */
  const handleCoinsChange = (value) => {
    const validValue = Math.min(Math.max(Number(value) || 0, 0), totalCoins);
    setCoinsToUse(validValue);
    setRemainingCoins(totalCoins - validValue);
  };

  /* ================= SAVE COINS ================= */
  const handleSave = () => {
    if (coinsToUse < 0 || coinsToUse > totalCoins) {
      Swal.fire(
        "Invalid Coins",
        `Max coins you can use: ${totalCoins}`,
        "error"
      );
      return;
    }

    localStorage.setItem("coinsToUse", coinsToUse);

    Swal.fire({
      icon: "success",
      title: "Coins Updated",
      text: `You are using ${coinsToUse} coins`,
    }).then(() => navigate("/cart"));
  };

  return (
    <div
      style={{
        maxWidth: "800px",
        margin: "50px auto",
        padding: "20px",
        border: "1px solid #ccc",
        borderRadius: "8px",
        textAlign: "center",
      }}
    >
      <h2>💰 Manage Coins</h2>

      <p>
        Total Coins: <strong>{totalCoins}</strong>
      </p>
      <p>
        Coins Selected: <strong>{coinsToUse}</strong>
      </p>
      <p>
        Remaining Coins: <strong>{remainingCoins}</strong>
      </p>

      <div style={{ margin: "20px 0" }}>
        <label>Choose Coins: </label>
        <input
          type="number"
          min="0"
          max={totalCoins}
          value={coinsToUse}
          onChange={(e) => handleCoinsChange(e.target.value)}
          style={{ marginLeft: "10px", width: "80px", padding: "5px" }}
        />
      </div>

      <div style={{ marginTop: "20px" }}>
        <button onClick={handleSave} style={btnPrimary}>
          Save Coins
        </button>

        <button onClick={() => navigate("/cart")} style={btnSecondary}>
          Back to Cart
        </button>
      </div>

      {/* ================= COIN HISTORY ================= */}
      <h3 style={{ marginTop: "40px" }}>📝 Coin History</h3>

      {coinHistory.length === 0 ? (
        <p>No coin history found</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#ff4d4d", color: "#fff" }}>
              <th style={thStyle}>Order</th>
              <th style={thStyle}>Earned</th>
              <th style={thStyle}>Used</th>
              <th style={thStyle}>Message</th>
              <th style={thStyle}>Date</th>
            </tr>
          </thead>

          <tbody>
            {coinHistory.map((item, index) => {
              // handle populated orderId object
              const orderId =
                item.orderId && typeof item.orderId === "object"
                  ? item.orderId._id
                  : item.orderId;

              return (
                <tr key={index} style={{ borderBottom: "1px solid #ccc" }}>
                  <td style={tdStyle}>{orderId ? orderId.slice(-6) : "N/A"}</td>
                  <td style={tdStyle}>{item.type === "earned" ? item.coins : 0}</td>
                  <td style={tdStyle}>{item.type === "used" ? item.coins : 0}</td>
                  <td style={tdStyle}>{item.message || "-"}</td>
                  <td style={tdStyle}>
                    {item.createdAt
                      ? new Date(item.createdAt).toLocaleString()
                      : "N/A"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Coins;

/* ================= STYLES ================= */
const thStyle = {
  padding: "8px",
  fontWeight: "bold",
};

const tdStyle = {
  padding: "8px",
};

const btnPrimary = {
  padding: "10px 20px",
  marginRight: "10px",
  backgroundColor: "#ff4d4d",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
};

const btnSecondary = {
  padding: "10px 20px",
  backgroundColor: "#555",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
};