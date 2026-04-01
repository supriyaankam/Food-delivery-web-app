// src/pages/Admin.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Admin = ({ user }) => {
  const navigate = useNavigate();

  const [foods, setFoods] = useState([]);
  const [form, setForm] = useState({
    name: "",
    price: "",
    category: "",
  });
  const [editingId, setEditingId] = useState(null);

  /* ================= REDIRECT NON-ADMIN ================= */
  useEffect(() => {
    if (!user?.isAdmin) {
      navigate("/login");
    }
  }, [user, navigate]);

  /* ================= FETCH FOODS ================= */
  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const res = await axios.get("/api/foods");
        setFoods(res.data || []);
      } catch (err) {
        console.error("Error fetching foods:", err);
      }
    };
    fetchFoods();
  }, []);

  /* ================= ADD / UPDATE FOOD ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.price || !form.category) {
      alert("All fields are required");
      return;
    }

    try {
      if (editingId) {
        // UPDATE
        await axios.put(`/api/foods/${editingId}`, form);

        setFoods((prev) =>
          prev.map((f) =>
            f._id === editingId ? { ...f, ...form } : f
          )
        );

        setEditingId(null);
      } else {
        // ADD
        const res = await axios.post("/api/foods", form);
        setFoods((prev) => [...prev, res.data]);
      }

      // RESET FORM
      setForm({ name: "", price: "", category: "" });
    } catch (err) {
      console.error("Error saving food:", err);
    }
  };

  /* ================= EDIT ================= */
  const handleEdit = (food) => {
    setForm({
      name: food.name,
      price: food.price,
      category: food.category,
    });
    setEditingId(food._id);
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;

    try {
      await axios.delete(`/api/foods/${id}`);
      setFoods((prev) => prev.filter((f) => f._id !== id));
    } catch (err) {
      console.error("Error deleting food:", err);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>🍔 Admin Panel - Manage Foods</h2>

      {/* ================= FORM ================= */}
      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Food Name"
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
          required
        />

        <input
          type="number"
          placeholder="Price"
          value={form.price}
          onChange={(e) =>
            setForm({ ...form, price: e.target.value })
          }
          required
        />

        <input
          type="text"
          placeholder="Category"
          value={form.category}
          onChange={(e) =>
            setForm({ ...form, category: e.target.value })
          }
          required
        />

        <button type="submit" style={{ marginLeft: "10px" }}>
          {editingId ? "Update Food" : "Add Food"}
        </button>
      </form>

      {/* ================= TABLE ================= */}
      {foods.length === 0 ? (
        <p>No food items found.</p>
      ) : (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
          }}
        >
          <thead>
            <tr style={{ borderBottom: "2px solid #ccc" }}>
              <th>Name</th>
              <th>Price (₹)</th>
              <th>Category</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {foods.map((food) => (
              <tr
                key={food._id}
                style={{ borderBottom: "1px solid #eee" }}
              >
                <td>{food.name}</td>
                <td>₹{food.price}</td>
                <td>{food.category}</td>
                <td>
                  <button onClick={() => handleEdit(food)}>
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(food._id)}
                    style={{ marginLeft: "10px", color: "red" }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Admin;