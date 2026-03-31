// src/pages/AdminFood.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AdminFood = ({ user }) => {
  const navigate = useNavigate();
  const [foods, setFoods] = useState([]);
  const [form, setForm] = useState({ name: "", price: "", category: "" });
  const [editingId, setEditingId] = useState(null);

  // ✅ Redirect non-admin users
  useEffect(() => {
    if (!user?.isAdmin) {
      navigate("/login");
    }
  }, [user, navigate]);

  // Fetch foods from backend (or use hardcoded data if backend not ready)
  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const res = await axios.get("/api/foods"); // Replace with your API
        setFoods(res.data);
      } catch (err) {
        console.error("Error fetching foods:", err);
      }
    };
    fetchFoods();
  }, []);

  // Add or Update food
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        // Update food
        await axios.put(`/api/foods/${editingId}`, form);
        setFoods((prev) =>
          prev.map((f) => (f._id === editingId ? { ...f, ...form } : f))
        );
        setEditingId(null);
      } else {
        // Add food
        const res = await axios.post("/api/foods", form);
        setFoods((prev) => [...prev, res.data]);
      }
      setForm({ name: "", price: "", category: "" });
    } catch (err) {
      console.error("Error saving food:", err);
    }
  };

  // Edit food
  const handleEdit = (food) => {
    setForm({ name: food.name, price: food.price, category: food.category });
    setEditingId(food._id);
  };

  // Delete food
  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/foods/${id}`);
      setFoods((prev) => prev.filter((f) => f._id !== id));
    } catch (err) {
      console.error("Error deleting food:", err);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Manage Foods 🍔</h2>

      {/* Form */}
      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Price"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Category"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          required
        />
        <button type="submit">{editingId ? "Update Food" : "Add Food"}</button>
      </form>

      {/* Foods list */}
      {foods.length === 0 ? (
        <p>No food items found.</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #ccc" }}>
              <th>Name</th>
              <th>Price</th>
              <th>Category</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {foods.map((food) => (
              <tr key={food._id} style={{ borderBottom: "1px solid #eee" }}>
                <td>{food.name}</td>
                <td>${food.price}</td>
                <td>{food.category}</td>
                <td>
                  <button onClick={() => handleEdit(food)}>Edit</button>
                  <button onClick={() => handleDelete(food._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminFood;