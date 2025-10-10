const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Token format: Bearer <token>
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Authorization token missing" });
  }

  const token = authHeader.split(" ")[1];

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    if (!req.user) return res.status(404).json({ message: "User not found" });

    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = authMiddleware;
