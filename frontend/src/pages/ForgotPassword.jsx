// src/pages/ForgotPassword.jsx
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/api/auth/forgot-password", { email });

      if (res.data.success) {
        Swal.fire({
          icon: "success",
          title: "OTP Sent ✅",
          text: `OTP: ${res.data.otp}. Use this to reset your password.`,
          confirmButtonColor: "#f97316",
        }).then(() => navigate("/reset-password", { state: { email } }));
      } else {
        setError(res.data.message || "Failed to send OTP");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Server error");
      console.error("Forgot Password Error:", err.response || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form className="login-card" onSubmit={handleSubmit}>
        <h2>Forgot Password</h2>
        {error && <p className="error">{error}</p>}

        <input
          type="email"
          placeholder="Enter your registered email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Sending OTP..." : "Send OTP"}
        </button>
      </form>

      <style>{`
        .login-container {
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          background: #fff1e6;
        }
        .login-card {
          background: #fff;
          padding: 30px;
          width: 360px;
          border-radius: 12px;
          box-shadow: 0 8px 20px rgba(0,0,0,0.15);
          text-align: center;
        }
        .login-card h2 {
          margin-bottom: 20px;
          color: #ea580c;
        }
        .login-card input {
          width: 100%;
          padding: 10px;
          margin-bottom: 15px;
          border-radius: 6px;
          border: 1px solid #ccc;
        }
        .login-card button {
          width: 100%;
          padding: 10px;
          background: linear-gradient(135deg, #ef4444, #f97316);
          color: white;
          border: none;
          border-radius: 6px;
          font-weight: bold;
          cursor: pointer;
        }
        .login-card button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .error {
          color: red;
          margin-bottom: 10px;
        }
      `}</style>
    </div>
  );
};

export default ForgotPassword;