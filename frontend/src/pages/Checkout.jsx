import { useContext } from "react";
import Swal from "sweetalert2";
import confetti from "canvas-confetti";
import { CartContext } from "../context/CartContext";
import "./cart.css";

const Cart = () => {
  const cartContext = useContext(CartContext);

  const cartItems = cartContext.cartItems;
  const removeFromCart = cartContext.removeFromCart;
  const totalPrice = cartContext.totalPrice;
  const clearCart = cartContext.clearCart;

  const deliveryFee = cartItems.length > 0 ? 15 : 0;
  const grandTotal = totalPrice + deliveryFee;

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      Swal.fire("Your cart is empty");
      return;
    }

    const orderData = {
      items: cartItems.map((item) => ({
        food: item._id,
        quantity: item.quantity,
      })),
      totalPrice: grandTotal,
      user: "Guest",
    };

    try {
      const res = await fetch(
        "http://localhost:5000/api/orders/add-order",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(orderData),
        }
      );

      const data = await res.json();

      if (res.ok) {
        // ✅ Full celebration popup with emoji confetti
        Swal.fire({
          html: `
            <div style="text-align:center; font-family: Arial;">
              <h1 style="font-size: 2.5rem; color: #ff4d4d; animation: bounce 1s infinite;">🎉 Order Placed! 🎉</h1>
              <p style="font-size: 1.2rem;">Your food is being prepared 🍕🍔🍟</p>
              <p style="font-size: 1rem;">Thank you for ordering ❤️</p>
            </div>
          `,
          background: "linear-gradient(135deg, #fff0f5, #ffe0e0)",
          showConfirmButton: true,
          confirmButtonText: "Awesome!",
          allowOutsideClick: false,
          didOpen: () => {
            // 🎊 Emoji confetti
            const duration = 3 * 1000;
            const animationEnd = Date.now() + duration;
            const defaults = { ticks: 60, gravity: 0.8, zIndex: 9999 };
            const emojis = ["🍕", "🍔", "🍟", "🥤", "🎉"];

            const interval = setInterval(() => {
              const timeLeft = animationEnd - Date.now();
              if (timeLeft <= 0) return clearInterval(interval);

              const emoji = emojis[Math.floor(Math.random() * emojis.length)];
              confetti({
                ...defaults,
                particleCount: 1,
                origin: { x: Math.random(), y: Math.random() - 0.2 },
                shapes: ["text"],
                scalar: 1.5,
                text: emoji,
              });
            }, 100);
          },
        }).then(() => {
          clearCart(); // clear cart after celebration
        });

      } else {
        Swal.fire("❌ Failed", data.message || "Checkout failed", "error");
      }
    } catch (error) {
      Swal.fire("⚠️ Error", "Server error", "error");
    }
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
                      src={item.image}
                      alt={item.name}
                      className="cart-img"
                    />
                  </td>
                  <td>{item.name}</td>
                  <td>₹{item.price}</td>
                  <td>{item.quantity}</td>
                  <td>₹{item.price * item.quantity}</td>
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
            <h3>Cart Total</h3>
            <p>
              Subtotal <span>₹{totalPrice}</span>
            </p>
            <p>
              Delivery Fee <span>₹{deliveryFee}</span>
            </p>
            <hr />
            <p className="total">
              Total <span>₹{grandTotal}</span>
            </p>

            <button className="checkout-btn" onClick={handleCheckout}>
              PROCEED TO CHECKOUT
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;

// Add bounce animation globally
const styleSheet = document.styleSheets[0];
styleSheet.insertRule(`
@keyframes bounce {
  0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-15px); }
  60% { transform: translateY(-7px); }
}
`, styleSheet.cssRules.length);