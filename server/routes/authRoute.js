const express = require('express');
const router = express.Router();

// ✅ UPDATED: Import the specific 'authMiddleware' function from the exported object
const { authMiddleware } = require('../middleware/authMiddleware');

const {
  registerUser,
  loginUser,
  getProfile
} = require('../controllers/authController');

// --- Public Routes ---
router.post('/register', registerUser);
router.post('/login', loginUser);

// --- Protected Route ---
// ✅ CORRECTED: Use 'authMiddleware' directly, without calling it with ()
// This route just checks if the user is logged in, no specific role required.
router.get('/profile', authMiddleware, getProfile);

module.exports = router;
