import { useState } from "react";
import { FaStar } from "react-icons/fa";

const StarRating = ({ rating, setRating }) => {
  const [hover, setHover] = useState(null);

  return (
    <div style={{ display: "flex", gap: "5px", cursor: "pointer" }}>
      {[...Array(5)].map((star, index) => {
        const ratingValue = index + 1;

        return (
          <FaStar
            key={index}
            size={25}
            color={ratingValue <= (hover || rating) ? "#ffc107" : "#e4e5e9"}
            onClick={() => setRating(ratingValue)}
            onMouseEnter={() => setHover(ratingValue)}
            onMouseLeave={() => setHover(null)}
          />
        );
      })}
    </div>
  );
};

export default StarRating;