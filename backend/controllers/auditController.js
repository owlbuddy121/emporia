const AuditLog = require('../models/AuditLog');

/**
 * @desc    Get all audit logs
 * @route   GET /api/audit-logs
 * @access  Private (Super Admin only)
 */
const getAuditLogs = async (req, res) => {
    try {
        const { action, performedBy, startDate, endDate, page = 1, limit = 20 } = req.query;

        // Build query
        const query = {};

        if (action) {
            query.action = { $regex: action, $options: 'i' };
        }

        if (performedBy) {
            query.performedBy = performedBy;
        }

        if (startDate || endDate) {
            query.createdAt = {};
            if (startDate) query.createdAt.$gte = new Date(startDate);
            if (endDate) query.createdAt.$lte = new Date(endDate);
        }

        // Execute query with pagination
        const auditLogs = await AuditLog.find(query)
            .populate('performedBy', 'name email role')
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort({ createdAt: -1 });

        const count = await AuditLog.countDocuments(query);

        res.status(200).json({
            success: true,
            count,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            auditLogs,
        });
    } catch (error) {
        console.error('Get audit logs error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
        });
    }
};

/**
 * @desc    Get audit log statistics
 * @route   GET /api/audit-logs/stats
 * @access  Private (Super Admin only)
 */
const getAuditStats = async (req, res) => {
    try {
        const totalLogs = await AuditLog.countDocuments();

        // Get action breakdown
        const actionStats = await AuditLog.aggregate([
            {
                $group: {
                    _id: '$action',
                    count: { $sum: 1 },
                },
            },
            { $sort: { count: -1 } },
            { $limit: 10 },
        ]);

        // Get recent activities
        const recentActivities = await AuditLog.find()
            .populate('performedBy', 'name email')
            .limit(10)
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            stats: {
                totalLogs,
                actionStats,
                recentActivities,
            },
        });
    } catch (error) {
        console.error('Get audit stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
        });
    }
};

module.exports = {
    getAuditLogs,
    getAuditStats,
};
