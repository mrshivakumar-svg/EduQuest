const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const authMiddleware = (role) => {
  return async (req, res, next) => {
    console.log("Auth middleware called"); // debug
    const authHeader = req.headers.authorization;
    console.log("Authorization header:", authHeader); // debug

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Authorization token missing" });
    }

    const token = authHeader.split(" ")[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findByPk(decoded.id, {
        attributes: { exclude: ["password"] },
      });

      if (!req.user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (role && req.user.role !== role) {
        return res.status(403).json({ message: "Unauthorized access" });
      }

      next(); // ✅ important!
    } catch (error) {
      console.error("Auth error:", error);
      return res.status(401).json({ message: "Invalid or expired token" });
    }
  };
};

module.exports = authMiddleware;
