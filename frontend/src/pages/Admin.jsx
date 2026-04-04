// src/pages/Admin.jsx
import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { getDefaultImage } from "../utils/defaultImages";
import { ThemeContext } from "../context/ThemeContext";

const Admin = ({ user }) => {
  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext);
  const isDark = theme === "dark";

  const [foods, setFoods] = useState([]);
  const [form, setForm] = useState({
    name: "",
    price: "",
    category: "",
    image: "",
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
        const res = await axios.get("http://localhost:5000/api/foods");
        // Access nested data.data similar to your other endpoints
        setFoods(res.data.data || res.data || []);
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
      Swal.fire({ icon: "error", title: "Oops...", text: "All fields are required" });
      return;
    }

    try {
      const config = {
        headers: { Authorization: `Bearer ${user?.token}` },
      };

      if (editingId) {
        // UPDATE
        await axios.put(`http://localhost:5000/api/foods/${editingId}`, form, config);

        setFoods((prev) =>
          prev.map((f) =>
            f._id === editingId ? { ...f, ...form } : f
          )
        );

        setEditingId(null);
      } else {
        // ADD
        const res = await axios.post("http://localhost:5000/api/foods", form, config);
        setFoods((prev) => [res.data.food || res.data, ...prev]);
      }

      // RESET FORM
      setForm({ name: "", price: "", category: "", image: "" });
      
      Swal.fire({
        icon: "success",
        title: editingId ? "Food Updated!" : "Food Added!",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 1500,
      });

    } catch (err) {
      console.error("Error saving food:", err);
      Swal.fire({ icon: "error", title: "Error", text: err.response?.data?.message || err.message });
    }
  };

  /* ================= EDIT ================= */
  const handleEdit = (food) => {
    setForm({
      name: food.name,
      price: food.price,
      category: food.category,
      image: food.image || "",
    });
    setEditingId(food._id);
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!"
    });

    if (!result.isConfirmed) return;

    try {
      const config = {
        headers: { Authorization: `Bearer ${user?.token}` },
      };
      await axios.delete(`http://localhost:5000/api/foods/${id}`, config);
      setFoods((prev) => prev.filter((f) => f._id !== id));
      
      Swal.fire({
        title: "Deleted!",
        text: "The food item has been deleted.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false
      });
    } catch (err) {
      console.error("Error deleting food:", err);
      Swal.fire({ icon: "error", title: "Error", text: err.response?.data?.message || err.message });
    }
  };

  return (
    <div className={`admin-container ${isDark ? "dark" : "light"}`}>
      <div className="admin-content">
        <h2>🍔 Admin Panel - Manage Foods</h2>

        {/* ================= FORM ================= */}
        <div className="admin-form-card">
          <form onSubmit={handleSubmit} className="admin-form">
            <div className="input-group">
              <input type="text" placeholder="Food Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              <input type="number" placeholder="Price (₹)" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
              <input type="text" placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required />
              <input type="text" placeholder="Image URL (Optional)" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
            </div>
            <button type="submit" className="submit-btn">
              {editingId ? "Update Food" : "Add Food"}
            </button>
          </form>
        </div>

        {/* ================= TABLE ================= */}
        {foods.length === 0 ? (
          <p className="no-data">No food items found.</p>
        ) : (
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Category</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {foods.map((food) => (
                  <tr key={food._id}>
                    <td>
                      <img 
                        src={food.image || getDefaultImage(food.category)} 
                        alt={food.name} 
                        className="food-thumb"
                        onError={(e) => { e.target.onerror = null; e.target.src = getDefaultImage(food.category) }}
                      />
                    </td>
                    <td className="fw-bold">{food.name}</td>
                    <td className="text-price">₹{food.price}</td>
                    <td><span className="category-badge">{food.category}</span></td>
                    <td>
                      <button className="action-btn edit" onClick={() => handleEdit(food)}>Edit</button>
                      <button className="action-btn delete" onClick={() => handleDelete(food._id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ================= STYLES ================= */}
      <style>{`
        .admin-container {
          min-height: 100vh;
          padding: 40px 20px;
          transition: all 0.3s ease;
        }
        .admin-container.light { 
          background: #f5f5f5; 
          color: #000; 
        }
        .admin-container.dark { 
          background: #121212; 
          color: #fff; 
        }

        .admin-content {
          max-width: 1000px;
          margin: 0 auto;
        }

        .admin-content h2 {
          text-align: center;
          margin-bottom: 30px;
          font-size: 2rem;
          color: #f97316;
        }

        .admin-form-card, .table-responsive {
          background: #fafafa;
          border-radius: 12px;
          box-shadow: 0 4px 10px rgba(0,0,0,0.1);
          transition: all 0.3s ease;
        }
        .admin-form-card {
          padding: 25px;
          margin-bottom: 40px;
        }
        .table-responsive {
          overflow-x: auto;
        }

        .dark .admin-form-card, .dark .table-responsive {
          background: #1f1f1f;
          box-shadow: 0 4px 15px rgba(0,0,0,0.5);
        }

        .admin-form .input-group {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 15px;
          margin-bottom: 20px;
        }

        .admin-form input {
          width: 100%;
          padding: 12px 15px;
          border: 1px solid #ccc;
          background: #fff;
          color: #000;
          border-radius: 8px;
          outline: none;
          font-size: 1rem;
          transition: border 0.2s;
        }

        .admin-form input:focus { border-color: #f97316; }

        .dark .admin-form input {
          border: 1px solid #444;
          background: #2e2e2e;
          color: #fff;
        }

        .submit-btn {
          width: 100%;
          padding: 12px;
          background: linear-gradient(135deg, #f97316, #ef4444);
          color: white;
          font-size: 1.1rem;
          font-weight: bold;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .submit-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(249, 115, 22, 0.4);
        }

        .admin-table {
          width: 100%;
          border-collapse: collapse;
          white-space: nowrap;
        }

        .admin-table th {
          background: #e5e7eb;
          padding: 15px;
          text-align: left;
          font-weight: 600;
          color: #374151;
          border-bottom: 2px solid #ccc;
        }

        .dark .admin-table th {
          background: #1a1a1a;
          color: #ccc;
          border-bottom: 2px solid #333;
        }

        .admin-table td {
          padding: 15px;
          border-bottom: 1px solid #eee;
          vertical-align: middle;
        }
        
        .dark .admin-table td {
          border-bottom: 1px solid #333;
        }

        .food-thumb {
          width: 60px;
          height: 60px;
          border-radius: 8px;
          object-fit: cover;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .fw-bold { font-weight: 600; }
        .text-price { color: #10b981; font-weight: bold; }
        
        .category-badge {
          background: #e0e7ff;
          color: #4f46e5;
          padding: 4px 10px;
          border-radius: 20px;
          font-size: 0.85rem;
          font-weight: 600;
        }
        
        .dark .category-badge {
          background: #312e81;
          color: #a5b4fc;
        }

        .action-btn {
          padding: 6px 12px;
          border: none;
          border-radius: 6px;
          font-weight: bold;
          cursor: pointer;
          margin-right: 8px;
          transition: background 0.2s;
        }

        .action-btn.edit {
          background: #f97316;
          color: white;
        }
        .action-btn.edit:hover { background: #ea580c; }

        .action-btn.delete {
          background: transparent;
          color: #ef4444;
          border: 1px solid #ef4444;
        }
        .action-btn.delete:hover {
          background: #ef4444;
          color: white;
        }

        .no-data {
          text-align: center;
          padding: 40px;
          font-size: 1.2rem;
          color: #94a3b8;
        }
      `}</style>
    </div>
  );
};

export default Admin;
