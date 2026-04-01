// src/pages/Login.jsx
import { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { UserContext } from "../context/UserContext";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { loginUser } = useContext(UserContext);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        formData
      );

      if (res.data.success) {
        const userData = res.data.data;

        if (userData.id && !userData._id) {
          userData._id = userData.id;
        }

        loginUser(userData);

        Swal.fire({
          icon: "success",
          title: "Login Successful 🎉",
          text: `Welcome back, ${userData.name}!`,
          confirmButtonColor: "#f97316",
        }).then(() => navigate("/"));
      } else {
        setError(res.data.message || "Login failed");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password");
    }
  };

  const handleSignup = () => {
    navigate("/signup");
  };

  return (
    <div className="signup-container"> {/* SAME container */}
      <form className="signup-card" onSubmit={handleSubmit}> {/* SAME card */}
        <h2>Login</h2>

        {error && <p className="error">{error}</p>}

        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <button type="submit">Login</button>

        <p className="login-text">
          New user?{" "}
          <button type="button" className="login-btn" onClick={handleSignup}>
            Signup
          </button>
        </p>
      </form>

      <style>{`
        .signup-container {
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          background: #fff1e6;
        }

        .signup-card {
          background: #fff;
          padding: 30px;
          width: 360px;
          border-radius: 12px;
          box-shadow: 0 8px 20px rgba(0,0,0,0.15);
          text-align: center;
        }

        .signup-card h2 {
          margin-bottom: 20px;
          color: #ea580c;
        }

        .signup-card input {
          width: 100%;
          padding: 10px;
          margin-bottom: 15px;
          border-radius: 6px;
          border: 1px solid #ccc;
        }

        .signup-card button {
          width: 100%;
          padding: 10px;
          background: linear-gradient(135deg, #ef4444, #f97316);
          color: white;
          border: none;
          border-radius: 6px;
          font-weight: bold;
          cursor: pointer;
        }

        .login-text {
          margin-top: 15px;
        }

        .login-btn {
          padding: 8px 16px;
          background: linear-gradient(135deg, #f97316, #ef4444);
          border: none;
          border-radius: 6px;
          color: white;
          font-weight: bold;
          cursor: pointer;
          margin-left: 5px;
        }

        .error {
          color: red;
          margin-bottom: 10px;
        }

        /* 🌙 DARK MODE SAME AS SIGNUP */
        body.dark .signup-container {
          background: #111827;
        }

        body.dark .signup-card {
          background: #1f2937;
          color: white;
        }

        body.dark .signup-card input {
          background: #374151;
          color: white;
          border: 1px solid #555;
        }

        body.dark .signup-card h2 {
          color: #fb923c;
        }

        body.dark .login-text {
          color: #d1d5db;
        }

      `}</style>
    </div>
  );
};

export default Login;