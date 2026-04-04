// src/components/FoodCard.jsx

import { useContext, useState, useEffect } from "react";
import Swal from "sweetalert2";
import { CartContext } from "../context/CartContext";
import { getDefaultImage } from "../utils/defaultImages";

const FoodCard = ({ food, isAdmin }) => {
  const { cartItems, addToCart, increaseQuantity, decreaseQuantity } =
    useContext(CartContext);

  const existingItem = cartItems.find((item) => item._id === food._id);

  const [quantity, setQuantity] = useState(
    existingItem ? existingItem.quantity : 1
  );

  useEffect(() => {
    if (existingItem) setQuantity(existingItem.quantity);
  }, [existingItem]);

  const handleAddToCart = () => {
    addToCart(food, quantity);

    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "success",
      title: `${food.name} added to cart`,
      showConfirmButton: false,
      timer: 1500,
    });
  };

  const handleIncrement = () => {
    setQuantity((prev) => prev + 1);
    if (existingItem) increaseQuantity(food._id);
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
      if (existingItem) decreaseQuantity(food._id);
    }
  };

  /* ⭐ STAR RATING */

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const halfStar = rating - fullStars >= 0.5;

    for (let i = 0; i < fullStars; i++) stars.push("★");

    if (halfStar) stars.push("★");

    while (stars.length < 5) stars.push("☆");

    return stars.join(" ");
  };

  return (
    <div className="food-card">
      
      {/* FOOD IMAGE */}
      <img
        className="food-image"
        src={food.image || getDefaultImage(food.category)}
        alt={food.name}
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = getDefaultImage(food.category);
        }}
      />

      {/* FOOD NAME */}
      <h3 className="food-name">{food.name}</h3>

      {/* DESCRIPTION */}
      <p className="food-desc">
        {food.description || "Delicious food made with love."}
      </p>

      {/* PRICE */}
      <p className="food-price">₹{food.price}</p>

      {/* RATING */}
      <p className="food-rating">
        {renderStars(food.rating || 0)} ({(food.rating || 0).toFixed(1)})
      </p>

      {!isAdmin && (
        <>
          {/* QUANTITY CONTROLS */}

          <div className="quantity-box">
            <button
              className="qty-button minus"
              onClick={handleDecrement}
            >
              -
            </button>

            <span className="qty-number">{quantity}</span>

            <button
              className="qty-button plus"
              onClick={handleIncrement}
            >
              +
            </button>
          </div>

          {/* ADD TO CART */}

          <button className="food-card-btn" onClick={handleAddToCart}>
            Add to Cart
          </button>
        </>
      )}
    </div>
  );
};

export default FoodCard;
