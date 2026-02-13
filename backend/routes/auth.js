const express = require('express');
const router = express.Router();
const { login, getMe, changePassword, resetPassword } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/rbac');

// Public routes
router.post('/login', login);

// Protected routes
router.get('/me', protect, getMe);
router.put('/change-password', protect, changePassword);
router.put('/reset-password/:userId', protect, authorize('user:reset-password'), resetPassword);

module.exports = router;
