// src/pages/Payment.jsx
import { useContext, useEffect, useState } from "react";
import Swal from "sweetalert2";
import confetti from "canvas-confetti";
import { CartContext } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { getDefaultImage } from "../utils/defaultImages";

const COIN_VALUE = 5;

const Payment = () => {
  const { clearCart, coins, fetchCoins } = useContext(CartContext);
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState([]);
  const [grandTotal, setGrandTotal] = useState(null);
  const [coinsUsed, setCoinsUsed] = useState(0);
  const [originalTotal, setOriginalTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [deliveryLocation, setDeliveryLocation] = useState("");
  const [orderPlaced, setOrderPlaced] = useState(false);

  /* ================= LOAD DATA ================= */
  useEffect(() => {
    if (orderPlaced) return;

    const storedItems = JSON.parse(localStorage.getItem("cartItems") || "[]");
    const total = Number(localStorage.getItem("grandTotal") || 0);
    const coinsToUse = Number(localStorage.getItem("coinsToUse") || 0);

    if (!storedItems.length || total <= 0) {
      Swal.fire({
        icon: "error",
        title: "Cart Empty",
        text: "Your cart is empty.",
      }).then(() => navigate("/cart"));
      return;
    }

    setCartItems(storedItems);
    setGrandTotal(total);

    const calculatedOriginal =
      storedItems.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      ) + 15;

    setOriginalTotal(calculatedOriginal);

    const maxAllowed = Math.floor(calculatedOriginal / COIN_VALUE);

    setCoinsUsed(Math.min(coinsToUse, coins, maxAllowed));
  }, [navigate, coins, orderPlaced]);

  /* ================= CONFETTI ================= */
  const triggerConfetti = () => {
    const duration = 3000;
    const end = Date.now() + duration;

    const interval = setInterval(() => {
      if (Date.now() > end) {
        clearInterval(interval);
        return;
      }

      confetti({
        particleCount: 40,
        spread: 360,
        startVelocity: 30,
        gravity: 0.5,
        ticks: 60,
        origin: { x: Math.random(), y: Math.random() - 0.2 },
      });
    }, 250);
  };

  /* ================= PAYMENT ================= */
  const handlePayment = async (method) => {
    if (loading) return;

    if (!deliveryLocation) {
      Swal.fire({
        icon: "warning",
        title: "Select Delivery Location",
      });
      return;
    }

    const user = JSON.parse(localStorage.getItem("userInfo") || "{}");

    if (!user?._id) {
      Swal.fire("Login Required", "", "error").then(() =>
        navigate("/login")
      );
      return;
    }

    const maxCoinsAllowed = Math.floor(originalTotal / COIN_VALUE);

    if (coinsUsed > maxCoinsAllowed) {
      Swal.fire({
        icon: "error",
        title: "Too many coins",
        text: `Max allowed: ${maxCoinsAllowed}`,
      });
      return;
    }

    setLoading(true);

    Swal.fire({
      title: "Processing Payment...",
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });

    try {
      /* ✅ ADD THIS DELAY (5 SECONDS BUFFERING) */
      await new Promise((resolve) => setTimeout(resolve, 5000));

      const orderItems = cartItems.map((item) => ({
        _id: item._id,
        name: item.name,
        price: Number(item.price),
        quantity: Number(item.quantity),
        image: item.image || getDefaultImage(item.category),
      }));

      const res = await axios.post("http://localhost:5000/api/orders", {
        userId: user._id,
        items: orderItems,
        totalAmount: grandTotal,
        paymentMethod: method,
        deliveryLocation,
        usedCoins: coinsUsed,
      });

      if (res.data.success) {
        setOrderPlaced(true);

        Swal.close();
        triggerConfetti();

        await fetchCoins();

        clearCart();
        localStorage.removeItem("cartItems");
        localStorage.removeItem("grandTotal");
        localStorage.removeItem("coinsToUse");

        Swal.fire({
          icon: "success",
          title: "Order Successful!",
          html: `
            <p>Delivery Location: ${deliveryLocation}</p>
            <p>Coins Used: ${coinsUsed}</p>
            <p>Available Coins: ${res.data.coins}</p>
          `,
          confirmButtonColor: "#ff4d4d",
        }).then(() => navigate("/"));
      } else {
        Swal.fire("Error", res.data.message, "error");
      }
    } catch (err) {
      Swal.fire(
        "Error",
        err.response?.data?.message || "Something went wrong",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  if (grandTotal === null) return null;

  return (
    <div style={styles.container}>
      <h2>💳 Select Payment Method</h2>

      <p>Total Amount: ₹{grandTotal.toFixed(2)}</p>

      <p>Available Coins: {coins}</p>
      <p>
        Coins Applied: {coinsUsed} (-₹{(coinsUsed * COIN_VALUE).toFixed(2)})
      </p>

      <div style={{ margin: "20px 0" }}>
        <label>Delivery Location: </label>

        <select
          value={deliveryLocation}
          onChange={(e) => setDeliveryLocation(e.target.value)}
          style={{ padding: "8px", marginLeft: "10px" }}
        >
          <option value="">-- Select --</option>
          <option value="Ratan Tata Bhavan">Ratan Tata Bhavan</option>
          <option value="KL Rao Bhavan">KL Rao Bhavan</option>
          <option value="Bill Gates Bhavan">Bill Gates Bhavan</option>
          <option value="Bhaskar Bhavan">Bhaskar Bhavan</option>
          <option value="Girls Hostel">Girls Hostel</option>
          <option value="Boys Hostel">Boys Hostel</option>
          <option value="Ramanujan Bhavan">Ramanujan Bhavan</option>
        </select>
      </div>

      <div style={styles.buttonsContainer}>
        <button
          style={styles.button}
          disabled={loading}
          onClick={() => handlePayment("GooglePay")}
        >
          Google Pay
        </button>

        <button
          style={styles.button}
          disabled={loading}
          onClick={() => handlePayment("PhonePe")}
        >
          PhonePe
        </button>

        <button
          style={styles.button}
          disabled={loading}
          onClick={() => handlePayment("COD")}
        >
          Cash on Delivery
        </button>
      </div>
    </div>
  );
};

export default Payment;

const styles = {
  container: { textAlign: "center", marginTop: 50 },
  buttonsContainer: {
    display: "flex",
    flexDirection: "column", // ✅ vertical stack
    alignItems: "center",    // center horizontally
    gap: 15,                 // space between buttons
    marginTop: 30,
  },
  button: {
    padding: "12px 25px",
    backgroundColor: "#ff4d4d",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    fontSize: 16,
    cursor: "pointer",
    width: 200, // optional: same width for all buttons
  },
};
