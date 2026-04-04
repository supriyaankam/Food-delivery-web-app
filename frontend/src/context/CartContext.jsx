// src/context/CartContext.jsx
import { createContext, useState, useEffect, useMemo, useCallback } from "react";
import axios from "axios";

export const CartContext = createContext();

const CartProvider = ({ children }) => {

  /* ================= CART ================= */
  const [cartItems, setCartItems] = useState(() => {
    try {
      const stored = localStorage.getItem("cartItems");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  /* ================= COINS ================= */
  const [coins, setCoins] = useState(0);

  // ✅ FIX: get userId correctly
  const getUserId = () => {
    const user = JSON.parse(localStorage.getItem("userInfo") || "{}");
    return user?._id;
  };

  // ✅ FETCH COINS FROM BACKEND
  const fetchCoins = useCallback(async () => {
    try {
      const userId = getUserId();
      if (!userId) return;

      const res = await axios.get(
        `http://localhost:5000/api/coins/${userId}`
      );

      setCoins(res.data.coins || 0);
    } catch (err) {
      console.error("Error fetching coins:", err);
    }
  }, []);

  /* ================= EFFECTS ================= */

  // Sync cart with localStorage
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  // Fetch coins on load
  useEffect(() => {
    fetchCoins();
  }, [fetchCoins]);

  /* ================= CART FUNCTIONS ================= */

  const addToCart = (food, quantity = 1) => {
    setCartItems((prev) => {
      const existingItem = prev.find((item) => item._id === food._id);

      if (existingItem) {
        return prev.map((item) =>
          item._id === food._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }

      return [...prev, { ...food, quantity }];
    });
  };

  const increaseQuantity = (foodId) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item._id === foodId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  const decreaseQuantity = (foodId) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item._id === foodId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const updateQuantity = (foodId, quantity) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item._id === foodId
          ? { ...item, quantity: Math.max(1, quantity) }
          : item
      )
    );
  };

  const removeFromCart = (foodId) => {
    setCartItems((prev) => prev.filter((item) => item._id !== foodId));
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem("cartItems");
  };

  /* ================= CALCULATIONS ================= */

  const totalPrice = useMemo(() => {
    return cartItems.reduce(
      (acc, item) => acc + Number(item.price) * item.quantity,
      0
    );
  }, [cartItems]);

  const totalItems = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + item.quantity, 0);
  }, [cartItems]);

  /* ================= PROVIDER ================= */

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        increaseQuantity,
        decreaseQuantity,
        updateQuantity,
        removeFromCart,
        clearCart,
        totalPrice,
        totalItems,

        // ✅ COINS (single source of truth)
        coins,
        fetchCoins, // important for Payment.jsx
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;
