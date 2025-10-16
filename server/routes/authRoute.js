const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');  // ✅ FIXED

const {
  registerUser,
  loginUser,
  getProfile
} = require('../controllers/authController');

// --- Public Routes ---
router.post('/register', registerUser);
router.post('/login', loginUser);

// --- Protected Route ---
router.get('/profile', authMiddleware(), getProfile); // ✅ CALL IT

module.exports = router;
