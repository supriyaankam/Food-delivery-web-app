// src/pages/user/CartPage.jsx
import { useContext } from "react";
import { CartContext } from "../../context/CartContext";

const CartPage = () => {
  const { cartItems, removeFromCart, clearCart } = useContext(CartContext);

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = () => {
    alert("Order placed successfully!"); // You can connect to backend to create order
    clearCart();
  };

  return (
    <div>
      <h2>Cart</h2>
      {cartItems.length === 0 ? <p>No items in cart</p> : (
        <>
          <ul>
            {cartItems.map(item => (
              <li key={item._id}>
                {item.name} - ₹{item.price} x {item.quantity}
                <button onClick={() => removeFromCart(item._id)}>Remove</button>
              </li>
            ))}
          </ul>
          <h3>Total: ₹{total}</h3>
          <button onClick={handleCheckout}>Checkout</button>
        </>
      )}
    </div>
  );
};

export default CartPage;