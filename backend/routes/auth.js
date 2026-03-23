const express = require('express');
const router = express.Router();
const { login, getProfile, changePassword, refreshToken } = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');

router.post('/login', login);
router.post('/refresh', authenticateToken, refreshToken);
router.get('/profile', authenticateToken, getProfile);
router.put('/change-password', authenticateToken, changePassword);

module.exports = router;
