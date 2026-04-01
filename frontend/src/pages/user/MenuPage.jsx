// src/pages/user/MenuPage.jsx
import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { CartContext } from "../../context/CartContext";

const MenuPage = () => {
  const { canteenId } = useParams();
  const [foods, setFoods] = useState([]);
  const [canteen, setCanteen] = useState({});
  const [loading, setLoading] = useState(true);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const canteenRes = await axios.get(`http://localhost:5000/api/canteens/public`);
        const selectedCanteen = canteenRes.data.data.find(c => c._id === canteenId);
        setCanteen(selectedCanteen);

        const { data } = await axios.get(`http://localhost:5000/api/foods/canteen/${canteenId}`);
        setFoods(data.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching menu:", err);
        setLoading(false);
      }
    };
    fetchMenu();
  }, [canteenId]);

  if (loading) return <p>Loading menu...</p>;

  return (
    <div>
      <h2>{canteen.name} Menu</h2>
      <div className="foods-container" style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
        {foods.map((food) => (
          <div 
            key={food._id} 
            className="food-card"
            style={{ border: "1px solid #ccc", padding: "10px", width: "220px" }}
          >
            <img
              src={food.image}
              alt={food.name}
              style={{ width: "200px", height: "150px", objectFit: "cover" }}
            />
            <h3>{food.name}</h3>
            <p>Price: ₹{food.price}</p>
            <button onClick={() => addToCart(food)}>Add to Cart</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MenuPage;