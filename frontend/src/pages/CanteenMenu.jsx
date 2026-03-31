import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const CanteenMenu = () => {

  const { id } = useParams();
  const [foods, setFoods] = useState([]);

  useEffect(() => {

    const fetchFoods = async () => {
      try {

        const res = await axios.get(
          `http://localhost:5000/api/foods/canteen/${id}`
        );

        setFoods(res.data.data);

      } catch (err) {
        console.error(err);
      }
    };

    fetchFoods();

  }, [id]);

  return (
    <div style={{ padding: "20px" }}>

      <h2>Canteen Menu</h2>

      {foods.map((food) => (

        <div
          key={food._id}
          style={{
            border: "1px solid #ccc",
            padding: "10px",
            marginBottom: "10px",
            borderRadius: "8px",
            width: "250px"
          }}
        >
          <h4>{food.name}</h4>
          <p>Price: ₹{food.price}</p>
          <p>Rating: ⭐ {food.rating}</p>
        </div>

      ))}

    </div>
  );
};

export default CanteenMenu;