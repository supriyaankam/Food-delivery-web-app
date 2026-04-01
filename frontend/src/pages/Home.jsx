// src/pages/Home.jsx

import { useEffect, useState } from "react";
import axios from "axios";
import FoodCard from "../components/FoodCard";

/* ================= CATEGORY IMAGES ================= */

const categoriesList = [
  { name: "Biryani", image: "/images/chickenbiryani.jpg" },
  { name: "Noodles", image: "/images/noodles.jpg" },
  { name: "Drinks", image: "/images/thumsup.jpg" },
  { name: "Icecreams", image: "/images/butterscotchicecream.jpg" },
  { name: "Mocktails", image: "/images/bluelagoon.jpg" },
  { name: "Milkshakes", image: "/images/choclatemilkshake.jpg" },
  { name: "Starters", image: "/images/chickenlollipop.jpg" },
  { name: "Snacks", image: "/images/samosa.jpg" },
  { name: "Fried Rice", image: "/images/cornrice.jpg" },
];

const Home = ({ search = "", user }) => {
  const [foods, setFoods] = useState([]);
  const [categories, setCategories] = useState([]);
  const [topDishes, setTopDishes] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const isAdmin = user?.isAdmin;

  /* ================= FETCH FOODS ================= */

  const fetchFoods = async () => {
    try {
      setLoading(true);

      const res = await axios.get("http://localhost:5000/api/foods");

      const allFoods = res.data.data || [];

      /* Remove duplicate foods */

      const uniqueFoods = allFoods.filter(
        (food, index, self) =>
          index === self.findIndex((f) => f.name === food.name)
      );

      setFoods(uniqueFoods);

      /* Unique categories */

      const uniqueCategories = [
        ...new Set(uniqueFoods.map((food) => food.category)),
      ];

      setCategories(uniqueCategories);

      /* Top 5 dishes */

      setTopDishes(uniqueFoods.slice(0, 5));

      setLoading(false);
    } catch (err) {
      console.error("Fetch foods error:", err.response?.data || err.message);

      setError("Failed to load foods");

      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFoods();
  }, []);

  if (loading) return <p className="loading">Loading foods...</p>;

  if (error) return <p className="error">{error}</p>;

  /* ================= FILTER FOODS ================= */

  const filteredFoods = selectedCategory
    ? foods.filter(
        (food) =>
          food.category === selectedCategory &&
          food.name.toLowerCase().includes(search.toLowerCase())
      )
    : foods.filter((food) =>
        food.name.toLowerCase().includes(search.toLowerCase())
      );

  return (
    <div className="container">
      {/* ================= CATEGORY SECTION ================= */}

      <div className="menu-categories">
        {categoriesList.map((cat) => (
          <div
            key={cat.name}
            className="category"
            style={{
              border:
                selectedCategory === cat.name
                  ? "2px solid #ff4d4d"
                  : "2px solid transparent",
            }}
            onClick={() =>
              setSelectedCategory(
                selectedCategory === cat.name ? "" : cat.name
              )
            }
          >
            <img src={cat.image} alt={cat.name} />

            <p>{cat.name}</p>
          </div>
        ))}
      </div>

      {/* ================= TOP DISHES ================= */}

      {!selectedCategory && topDishes.length > 0 && (
        <div className="section">
          <h2 className="section-title">Top Dishes Near You 🍽️</h2>

          <div className="food-grid">
            {topDishes.map((food) => (
              <FoodCard
                key={food._id}
                food={food}
                user={user}
                isAdmin={isAdmin}
              />
            ))}
          </div>
        </div>
      )}

      {/* ================= CATEGORY FOOD ================= */}

      {selectedCategory ? (
        <div className="section">
          <h2 className="section-title">{selectedCategory}</h2>

          <div className="food-grid">
            {filteredFoods.length > 0 ? (
              filteredFoods.map((food) => (
                <FoodCard
                  key={food._id}
                  food={food}
                  user={user}
                  isAdmin={isAdmin}
                />
              ))
            ) : (
              <p style={{ textAlign: "center" }}>
                No foods available in this category
              </p>
            )}
          </div>
        </div>
      ) : (
        categories.map((category) => {
          const categoryFoods = foods.filter(
            (food) =>
              food.category === category &&
              food.name.toLowerCase().includes(search.toLowerCase())
          );

          if (categoryFoods.length === 0) return null;

          return (
            <div className="section" key={category}>
              <h2 className="section-title">{category}</h2>

              <div className="food-grid">
                {categoryFoods.map((food) => (
                  <FoodCard
                    key={food._id}
                    food={food}
                    user={user}
                    isAdmin={isAdmin}
                  />
                ))}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default Home;