const jwt = require('jsonwebtoken');
const { User } = require('../models'); // Make sure the path to your models is correct

/**
 * Middleware to check for a valid JWT token
 */
const authMiddleware = async (req, res, next) => {
  let token;

  // Check if the token exists and starts with 'Bearer '
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Extract token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify the token using the secret key
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find the user associated with the token ID
      // Exclude the password from the user object attached to the request
      req.user = await User.findByPk(decoded.id, {
        attributes: { exclude: ['password'] } // Use 'password_hash' if that's your column name
      });

      // If user not found (e.g., deleted after token was issued)
      if (!req.user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Proceed to the next middleware or route handler
      next();
    } catch (error) {
      // Handle errors like invalid signature or expired token
      console.error('Token verification failed:', error.message);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  // If no token was found in the header
  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

/**
 * Middleware factory to check if the logged-in user has one of the specified roles
 * @param {...string} roles - The roles allowed to access the route
 */
const roleMiddleware = (...roles) => {
  return (req, res, next) => {
    // Check if the user object exists (added by authMiddleware) and if their role is included in the allowed roles
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden: You do not have permission for this action' });
    }
    // If the role matches, proceed
    next();
  };
};

// Export both middleware functions in an object
module.exports = {
  authMiddleware,
  roleMiddleware
};

