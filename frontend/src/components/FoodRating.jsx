import React, { useState } from "react";
import axios from "axios";

const FoodRating = ({ orderId, food }) => {
  const [rating, setRating] = useState(food.rating || 0);

  const submitRating = () => {
    axios
      .post(`http://localhost:5000/api/orders/${orderId}/rate`, {
        foodId: food._id,
        rating: Number(rating),
        userId: localStorage.getItem("userId"), // must match logged-in user
      })
      .then(() => alert("Rating added"))
      .catch((err) => console.log(err));
  };

  return (
    <div style={{ marginTop: "5px" }}>
      <span>{food.name}</span>
      <select
        value={rating}
        onChange={(e) => setRating(e.target.value)}
        style={{ marginLeft: "10px" }}
      >
        {[1, 2, 3, 4, 5].map((n) => (
          <option key={n} value={n}>
            {n} Star{n > 1 ? "s" : ""}
          </option>
        ))}
      </select>
      <button onClick={submitRating} style={{ marginLeft: "10px" }}>
        Submit
      </button>
    </div>
  );
};

export default FoodRating;