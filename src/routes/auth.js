const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const {
  register,
  login,
  getProfile,
  verifyToken
} = require('../controllers/authController');

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/profile', authenticateToken, getProfile);
router.get('/verify', authenticateToken, verifyToken);

module.exports = router;