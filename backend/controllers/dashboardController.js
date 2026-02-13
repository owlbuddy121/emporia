const User = require('../models/User');
const Department = require('../models/Department');
const Leave = require('../models/Leave');

/**
 * @desc    Get dashboard statistics
 * @route   GET /api/dashboard/stats
 * @access  Private
 */
const getDashboardStats = async (req, res) => {
    try {
        const userRole = req.user.role.name;

        // Basic stats for all authenticated users
        // But the level of detail might depend on role

        let stats = {};

        if (userRole === 'Super Admin' || userRole === 'HR Admin') {
            // High-level system stats
            const [totalEmployees, totalDepartments, pendingLeaves, activeEmployees] = await Promise.all([
                User.countDocuments({ isDeleted: false }),
                Department.countDocuments(),
                Leave.countDocuments({ status: 'pending' }),
                User.countDocuments({ isDeleted: false, status: 'active' })
            ]);

            stats = {
                totalEmployees,
                activeEmployees,
                totalDepartments,
                pendingLeaves,
                complianceRate: 98, // Hardcoded for now or calculated based on some metric
                newJoinersThisMonth: 2 // Calculated if needed
            };
        } else if (userRole === 'Manager') {
            // Stats for the manager's department
            const teamQuery = { department: req.user.department, isDeleted: false };
            const teamMembers = await User.find(teamQuery).select('_id');
            const teamMemberIds = teamMembers.map(m => m._id);

            const [totalTeam, pendingTeamLeaves, activeTeam] = await Promise.all([
                User.countDocuments(teamQuery),
                Leave.countDocuments({ employee: { $in: teamMemberIds }, status: 'pending' }),
                User.countDocuments({ ...teamQuery, status: 'active' })
            ]);

            stats = {
                totalEmployees: totalTeam,
                activeEmployees: activeTeam,
                pendingLeaves: pendingTeamLeaves,
                departmentName: req.user.department?.name || 'Your Department'
            };
        } else {
            // Stats for an individual employee
            const [myPendingLeaves, myTotalLeaves] = await Promise.all([
                Leave.countDocuments({ employee: req.user.id, status: 'pending' }),
                Leave.countDocuments({ employee: req.user.id })
            ]);

            stats = {
                myPendingLeaves,
                myTotalLeaves,
            };
        }

        res.status(200).json({
            success: true,
            stats
        });
    } catch (error) {
        console.error('Get dashboard stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

module.exports = {
    getDashboardStats
};
