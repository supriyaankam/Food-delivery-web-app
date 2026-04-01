// middleware/auth.js
import jwt from "jsonwebtoken";
import User from "../models/User.js"; // your User model

const authMiddleware = async (req, res, next) => {
  try {
    // Get token from headers
    const token = req.headers.authorization?.split(" ")[1]; // "Bearer <token>"

    if (!token) {
      return res.status(401).json({ success: false, message: "No token, authorization denied" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");

    // Check if user is admin
    if (!req.user.isAdmin) {
      return res.status(403).json({ success: false, message: "Access denied. Admin only." });
    }

    next(); // pass to route handler
  } catch (err) {
    console.error("Auth middleware error:", err);
    res.status(401).json({ success: false, message: "Token is not valid" });
  }
};

export default authMiddleware;