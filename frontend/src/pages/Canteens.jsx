// src/pages/Canteens.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Canteens = () => {
  const [canteens, setCanteens] = useState([]);

  useEffect(() => {
    const fetchCanteens = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:5000/api/canteens/public"
        );
        setCanteens(data.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCanteens();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Available Canteens</h2>

      {canteens.map((c) => (
        <Link
          key={c._id}
          to={`/canteens/${c._id}`}
          style={{ textDecoration: "none", color: "black" }}
        >
          <div
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              marginBottom: "15px",
              borderRadius: "8px",
              width: "220px",
            }}
          >
            <img
              src={`http://localhost:5000${c.image}`}
              alt={c.name}
              style={{
                width: "200px",
                height: "150px",
                objectFit: "cover",
                borderRadius: "6px",
              }}
            />
            <h4>{c.name}</h4>
            <p>{c.location}</p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default Canteens;