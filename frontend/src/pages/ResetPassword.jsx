// src/pages/ResetPassword.jsx
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const email = location.state?.email;

  useEffect(() => {
    if (!email) {
      // Redirect to forgot-password if no email in state
      navigate("/forgot-password");
    }
  }, [email, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!otp.trim() || !newPassword.trim()) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/auth/reset-password", {
        email,
        otp: otp.trim(),
        newPassword: newPassword.trim(),
      });

      if (res.data.success) {
        Swal.fire({
          icon: "success",
          title: "Password Reset ✅",
          text: res.data.message,
          confirmButtonColor: "#f97316",
        }).then(() => {
          // Redirect to Login with prefilled email
          navigate("/login", { state: { email } });
        });
      } else {
        setError(res.data.message || "Failed to reset password");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Server error");
      console.error("Reset Password Error:", err.response || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form className="login-card" onSubmit={handleSubmit}>
        <h2>Reset Password</h2>

        {error && <p className="error">{error}</p>}

        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Enter new password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Resetting..." : "Reset Password"}
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
        .login-card button:hover:not(:disabled) {
          opacity: 0.9;
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

export default ResetPassword;