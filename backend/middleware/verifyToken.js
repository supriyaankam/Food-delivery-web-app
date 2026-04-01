// middleware/verifyToken.js
import jwt from "jsonwebtoken";
import User from "../models/User.js";

/* ================= Verify Logged-in User ================= */
export const verifyToken = async (req, res, next) => {
  try {
    // 1️⃣ Check if Authorization header exists and starts with "Bearer "
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "No token provided, authorization denied",
      });
    }

    // 2️⃣ Extract token from header
    const token = authHeader.split(" ")[1].trim();
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token missing",
      });
    }

    // 3️⃣ Verify JWT token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token",
      });
    }

    // 4️⃣ Find user in DB and attach to request (exclude password)
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    req.user = user; // Attach user to request
    next(); // Proceed to next middleware or route
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(500).json({
      success: false,
      message: "Server error in authentication middleware",
    });
  }
};