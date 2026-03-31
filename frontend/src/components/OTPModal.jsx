// src/components/OTPModal.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";

const OTPModal = ({ orderId, userId, onSuccess, onClose }) => {
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  // Generate OTP when modal mounts
  useEffect(() => {
    generateOTP();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const generateOTP = async () => {
    try {
      setResendLoading(true);
      const res = await axios.post("http://localhost:5000/api/orders/generate-otp", {
        userId,
        orderId,
      });
      setMessage(res.data.message || "OTP sent to your email/phone!");
    } catch (err) {
      console.error(err);
      setMessage("Failed to generate OTP. Try again.");
    } finally {
      setResendLoading(false);
    }
  };

  const verifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      setMessage("Enter a valid 6-digit OTP.");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post("http://localhost:5000/api/orders/verify-otp", {
        orderId,
        enteredOtp: otp,
      });

      setMessage(res.data.message || "Payment successful!");
      if (onSuccess) onSuccess(res.data.data); // Return updated order
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || "Incorrect OTP. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="otp-modal-backdrop">
      <div className="otp-modal">
        <h2>Enter OTP to Complete Payment</h2>

        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))} // allow only numbers
          placeholder="Enter 6-digit OTP"
          maxLength={6}
        />

        <button onClick={verifyOTP} disabled={loading}>
          {loading ? "Verifying..." : "Verify OTP"}
        </button>

        <button onClick={generateOTP} disabled={resendLoading} style={{ marginTop: "0.5rem" }}>
          {resendLoading ? "Resending..." : "Resend OTP"}
        </button>

        {message && <p style={{ marginTop: "10px", color: message.includes("failed") || message.includes("Incorrect") ? "red" : "green" }}>{message}</p>}

        <button onClick={onClose} className="close-btn">
          Cancel
        </button>
      </div>

      <style jsx>{`
        .otp-modal-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }
        .otp-modal {
          background: #fff;
          padding: 2rem;
          border-radius: 12px;
          width: 320px;
          max-width: 90%;
          text-align: center;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
        }
        input {
          width: 100%;
          padding: 0.5rem;
          margin: 1rem 0;
          font-size: 1rem;
          text-align: center;
          border-radius: 6px;
          border: 1px solid #ccc;
        }
        button {
          padding: 0.6rem 1rem;
          margin-top: 0.5rem;
          cursor: pointer;
          border: none;
          border-radius: 6px;
          background: #ff4d4d;
          color: #fff;
          font-weight: bold;
        }
        button:disabled {
          background: #ccc;
          cursor: not-allowed;
        }
        .close-btn {
          background: #aaa;
          margin-top: 1rem;
        }
      `}</style>
    </div>
  );
};

export default OTPModal;