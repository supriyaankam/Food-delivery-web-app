// otpController.js
import crypto from "crypto";

let otpStore = {}; // In-memory store: { userId: { otp, expires } }

export const sendOTP = (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ success: false, message: "userId required" });
  }

  // Generate 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // Set expiration: 5 minutes
  const expires = Date.now() + 5 * 60 * 1000;

  otpStore[userId] = { otp, expires };

  console.log(`OTP for ${userId}: ${otp}`); // For testing, log it

  // In real apps, send via SMS/email here

  res.json({ success: true, message: "OTP sent successfully" });
};

export const verifyOTP = (req, res) => {
  const { userId, otp } = req.body;

  if (!userId || !otp) {
    return res.status(400).json({ success: false, message: "userId and otp required" });
  }

  const record = otpStore[userId];

  if (!record) {
    return res.status(400).json({ success: false, message: "No OTP found for this user" });
  }

  if (Date.now() > record.expires) {
    delete otpStore[userId];
    return res.status(400).json({ success: false, message: "OTP expired" });
  }

  if (record.otp !== otp) {
    return res.status(400).json({ success: false, message: "Invalid OTP" });
  }

  // OTP verified, remove it
  delete otpStore[userId];

  res.json({ success: true, message: "OTP verified successfully" });
};