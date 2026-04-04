// src/pages/Cart.jsx
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { getDefaultImage } from "../utils/defaultImages";
import "./cart.css";

const COIN_VALUE = 5;

const Cart = () => {
  const {
    cartItems = [],
    totalPrice = 0,
    removeFromCart,
    updateQuantity,
    coins,
  } = useContext(CartContext);

  const navigate = useNavigate();

  const [coinsToUse, setCoinsToUse] = useState(0);
  const [grandTotal, setGrandTotal] = useState(totalPrice);

  const deliveryFee = cartItems.length > 0 ? 15 : 0;

  /* ================= LOAD COINS ================= */
  useEffect(() => {
    const savedCoinsToUse = Number(localStorage.getItem("coinsToUse") || 0);

    const maxCoinsAllowed = Math.floor(
      (totalPrice + deliveryFee) / COIN_VALUE
    );

    const validCoins = Math.min(savedCoinsToUse, coins, maxCoinsAllowed);

    setCoinsToUse(validCoins);
  }, [coins, totalPrice, deliveryFee]);

  /* ================= CALCULATE GRAND TOTAL ================= */
  useEffect(() => {
    const discount = coinsToUse * COIN_VALUE;
    const total = totalPrice + deliveryFee - discount;
    setGrandTotal(total >= 0 ? total : 0);
  }, [totalPrice, coinsToUse, deliveryFee]);

  /* ================= HANDLE COINS ================= */
  const handleCoinsChange = (e) => {
    let value = Number(e.target.value);

    const maxCoinsAllowed = Math.floor(
      (totalPrice + deliveryFee) / COIN_VALUE
    );

    if (value > coins) value = coins;
    if (value > maxCoinsAllowed) value = maxCoinsAllowed;
    if (value < 0) value = 0;

    setCoinsToUse(value);
    localStorage.setItem("coinsToUse", value);
  };

  /* ================= CHECKOUT ================= */
  const handleCheckout = () => {
    const user = JSON.parse(localStorage.getItem("userInfo") || "{}");

    if (!user?._id) {
      alert("Please login first");
      navigate("/login");
      return;
    }

    if (cartItems.length === 0) {
      alert("Cart is empty!");
      return;
    }

    localStorage.setItem("cartItems", JSON.stringify(cartItems));
    localStorage.setItem("grandTotal", grandTotal);
    localStorage.setItem("coinsToUse", coinsToUse);

    navigate("/payment");
  };

  return (
    <div className="cart-container">
      <h2>🛒 Cart</h2>

      {cartItems.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <>
          <table className="cart-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Title</th>
                <th>Price</th>
                <th>Qty</th>
                <th>Total</th>
                <th>Remove</th>
              </tr>
            </thead>

            <tbody>
              {cartItems.map((item) => (
                <tr key={item._id}>
                  <td>
                    <img
                      src={item.image || getDefaultImage(item.category)}
                      alt={item.name}
                      className="cart-img"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = getDefaultImage(item.category);
                      }}
                    />
                  </td>
                  <td>{item.name}</td>
                  <td>₹{item.price.toFixed(2)}</td>

                  <td>
                    <select
                      value={item.quantity}
                      onChange={(e) =>
                        updateQuantity(item._id, Number(e.target.value))
                      }
                      className="qty-dropdown"
                    >
                      {[...Array(10).keys()].map((x) => (
                        <option key={x + 1} value={x + 1}>
                          {x + 1}
                        </option>
                      ))}
                    </select>
                  </td>

                  <td>₹{(item.price * item.quantity).toFixed(2)}</td>

                  <td>
                    <button
                      className="remove-btn"
                      onClick={() => removeFromCart(item._id)}
                    >
                      ✕
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="cart-summary">
            <h3>Cart Summary</h3>

            <p>
              Subtotal <span>₹{totalPrice.toFixed(2)}</span>
            </p>

            <p>
              Delivery Fee <span>₹{deliveryFee.toFixed(2)}</span>
            </p>

            <p>
              Available Coins: <span>{coins}</span>
            </p>

            {/* ✅ NEW: Max coins hint */}
            <p style={{ fontSize: "14px", color: "#888" }}>
              Max usable coins:{" "}
              {Math.min(
                coins,
                Math.floor((totalPrice + deliveryFee) / COIN_VALUE)
              )}
            </p>

            <div style={{ margin: "10px 0" }}>
              <label>Use Coins: </label>

              <input
                type="number"
                min={0}
                max={coins}
                value={coinsToUse}
                onChange={handleCoinsChange}
                style={{ marginLeft: "10px", width: "80px" }}
              />

              <span style={{ marginLeft: "10px" }}>
                (-₹{(coinsToUse * COIN_VALUE).toFixed(2)})
              </span>
            </div>

            <hr />

            <p className="total">
              Grand Total <span>₹{grandTotal.toFixed(2)}</span>
            </p>

            <button className="checkout-btn" onClick={handleCheckout}>
              Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
