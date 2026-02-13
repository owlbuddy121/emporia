const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { jwtSecret, jwtExpire } = require('../config/jwt');
const createAuditLog = require('../utils/auditLogger');

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log('Login attempt:', { email, passwordProvided: !!password });

        // Validate input
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email and password',
            });
        }

        // Check if user exists
        const user = await User.findOne({ email, isDeleted: false })
            .select('+password')
            .populate('role')
            .populate('department');

        if (!user) {
            console.log('User not found for email:', email);
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials',
            });
        }

        // Check if user is active
        if (user.status !== 'active') {
            return res.status(401).json({
                success: false,
                message: 'Your account is inactive. Please contact administrator.',
            });
        }

        // Check password
        const isPasswordMatch = await user.comparePassword(password);

        if (!isPasswordMatch) {
            console.log('Password mismatch for user:', email);
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials',
            });
        }
        console.log('Login successful for:', email);

        // Create token
        const token = jwt.sign({ id: user._id }, jwtSecret, {
            expiresIn: jwtExpire,
        });

        // Create audit log
        await createAuditLog({
            action: 'user:login',
            performedBy: user._id,
            description: `User ${user.name} logged in`,
            ipAddress: req.ip,
        });

        // Remove password from response
        user.password = undefined;

        res.status(200).json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                department: user.department,
                profilePicture: user.profilePicture,
            },
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
        });
    }
};

/**
 * @desc    Get current logged in user
 * @route   GET /api/auth/me
 * @access  Private
 */
const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
            .populate('role')
            .populate('department');

        res.status(200).json({
            success: true,
            user,
        });
    } catch (error) {
        console.error('Get me error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
        });
    }
};

/**
 * @desc    Change password
 * @route   PUT /api/auth/change-password
 * @access  Private
 */
const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: 'Please provide current and new password',
            });
        }

        // Get user with password
        const user = await User.findById(req.user.id).select('+password');

        // Check current password
        const isPasswordMatch = await user.comparePassword(currentPassword);

        if (!isPasswordMatch) {
            return res.status(401).json({
                success: false,
                message: 'Current password is incorrect',
            });
        }

        // Update password
        user.password = newPassword;
        await user.save();

        // Create audit log
        await createAuditLog({
            action: 'user:change-password',
            performedBy: user._id,
            description: `User ${user.name} changed password`,
            ipAddress: req.ip,
        });

        res.status(200).json({
            success: true,
            message: 'Password changed successfully',
        });
    } catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
        });
    }
};

/**
 * @desc    Reset password (admin only)
 * @route   PUT /api/auth/reset-password/:userId
 * @access  Private (Super Admin, HR Admin)
 */
const resetPassword = async (req, res) => {
    try {
        const { newPassword } = req.body;
        const { userId } = req.params;

        if (!newPassword) {
            return res.status(400).json({
                success: false,
                message: 'Please provide new password',
            });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        // Update password
        user.password = newPassword;
        await user.save();

        // Create audit log
        await createAuditLog({
            action: 'user:reset-password',
            performedBy: req.user.id,
            description: `Admin ${req.user.name} reset password for user ${user.name}`,
            targetModel: 'User',
            targetId: user._id,
            ipAddress: req.ip,
        });

        res.status(200).json({
            success: true,
            message: 'Password reset successfully',
        });
    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
        });
    }
};

module.exports = {
    login,
    getMe,
    changePassword,
    resetPassword,
};
