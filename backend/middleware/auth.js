const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { jwtSecret } = require('../config/jwt');

/**
 * Protect routes - verify JWT token
 */
const protect = async (req, res, next) => {
    let token;

    // Check for token in headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    // Make sure token exists
    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized to access this route',
        });
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, jwtSecret);

        // Get user from token
        req.user = await User.findById(decoded.id)
            .populate('role')
            .populate('department');

        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'User not found',
            });
        }

        // Check if user is active
        if (req.user.status !== 'active') {
            return res.status(401).json({
                success: false,
                message: 'User account is inactive',
            });
        }

        // Check if user is deleted
        if (req.user.isDeleted) {
            return res.status(401).json({
                success: false,
                message: 'User account has been deleted',
            });
        }

        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized to access this route',
        });
    }
};

module.exports = { protect };
