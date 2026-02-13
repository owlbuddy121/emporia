const Leave = require('../models/Leave');
const User = require('../models/User');
const createAuditLog = require('../utils/auditLogger');

/**
 * @desc    Get all leaves (filtered by role)
 * @route   GET /api/leaves
 * @access  Private
 */
const getLeaves = async (req, res) => {
    try {
        const { status, startDate, endDate, page = 1, limit = 10 } = req.query;
        const userRole = req.user.role.name;

        // Build query based on role
        let query = {};

        if (userRole === 'Employee') {
            // Employees can only see their own leaves
            query.employee = req.user.id;
        } else if (userRole === 'Manager') {
            // Managers can see their team's leaves
            const teamMembers = await User.find({
                department: req.user.department,
                isDeleted: false,
            }).select('_id');

            const teamMemberIds = teamMembers.map(member => member._id);
            query.employee = { $in: teamMemberIds };
        }
        // Super Admin and HR Admin can see all leaves

        // Apply filters
        if (status) {
            query.status = status;
        }

        if (startDate || endDate) {
            query.startDate = {};
            if (startDate) query.startDate.$gte = new Date(startDate);
            if (endDate) query.startDate.$lte = new Date(endDate);
        }

        // Execute query with pagination
        const leaves = await Leave.find(query)
            .populate('employee', 'name email department')
            .populate('approver', 'name email')
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort({ createdAt: -1 });

        const count = await Leave.countDocuments(query);

        res.status(200).json({
            success: true,
            count,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            leaves,
        });
    } catch (error) {
        console.error('Get leaves error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
        });
    }
};

/**
 * @desc    Get my leaves
 * @route   GET /api/leaves/my-leaves
 * @access  Private
 */
const getMyLeaves = async (req, res) => {
    try {
        const leaves = await Leave.find({ employee: req.user.id })
            .populate('approver', 'name email')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: leaves.length,
            leaves,
        });
    } catch (error) {
        console.error('Get my leaves error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
        });
    }
};

/**
 * @desc    Apply for leave
 * @route   POST /api/leaves
 * @access  Private
 */
const applyLeave = async (req, res) => {
    try {
        const { leaveType, startDate, endDate, reason } = req.body;

        // Validate dates
        if (new Date(startDate) > new Date(endDate)) {
            return res.status(400).json({
                success: false,
                message: 'End date must be after start date',
            });
        }

        // Create leave
        const leave = await Leave.create({
            employee: req.user.id,
            leaveType,
            startDate,
            endDate,
            reason,
        });

        // Create audit log
        await createAuditLog({
            action: 'leave:apply',
            performedBy: req.user.id,
            description: `Applied for ${leaveType} from ${startDate} to ${endDate}`,
            targetModel: 'Leave',
            targetId: leave._id,
            ipAddress: req.ip,
        });

        await leave.populate('employee', 'name email');

        res.status(201).json({
            success: true,
            message: 'Leave application submitted successfully',
            leave,
        });
    } catch (error) {
        console.error('Apply leave error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
        });
    }
};

/**
 * @desc    Approve leave
 * @route   PUT /api/leaves/:id/approve
 * @access  Private (HR Admin, Manager)
 */
const approveLeave = async (req, res) => {
    try {
        const { comments } = req.body;

        const leave = await Leave.findById(req.params.id)
            .populate('employee', 'name email department');

        if (!leave) {
            return res.status(404).json({
                success: false,
                message: 'Leave not found',
            });
        }

        // Check if already processed
        if (leave.status !== 'pending') {
            return res.status(400).json({
                success: false,
                message: 'Leave has already been processed',
            });
        }

        // If manager, check if leave is for their team
        if (req.user.role.name === 'Manager') {
            if (leave.employee.department.toString() !== req.user.department.toString()) {
                return res.status(403).json({
                    success: false,
                    message: 'You can only approve leaves for your team members',
                });
            }
        }

        // Update leave
        leave.status = 'approved';
        leave.approver = req.user.id;
        leave.approverComments = comments;
        leave.approvedAt = new Date();
        await leave.save();

        // Create audit log
        await createAuditLog({
            action: 'leave:approve',
            performedBy: req.user.id,
            description: `Approved leave for ${leave.employee.name}`,
            targetModel: 'Leave',
            targetId: leave._id,
            ipAddress: req.ip,
        });

        await leave.populate('approver', 'name email');

        res.status(200).json({
            success: true,
            message: 'Leave approved successfully',
            leave,
        });
    } catch (error) {
        console.error('Approve leave error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
        });
    }
};

/**
 * @desc    Reject leave
 * @route   PUT /api/leaves/:id/reject
 * @access  Private (HR Admin, Manager)
 */
const rejectLeave = async (req, res) => {
    try {
        const { comments } = req.body;

        const leave = await Leave.findById(req.params.id)
            .populate('employee', 'name email department');

        if (!leave) {
            return res.status(404).json({
                success: false,
                message: 'Leave not found',
            });
        }

        // Check if already processed
        if (leave.status !== 'pending') {
            return res.status(400).json({
                success: false,
                message: 'Leave has already been processed',
            });
        }

        // If manager, check if leave is for their team
        if (req.user.role.name === 'Manager') {
            if (leave.employee.department.toString() !== req.user.department.toString()) {
                return res.status(403).json({
                    success: false,
                    message: 'You can only reject leaves for your team members',
                });
            }
        }

        // Update leave
        leave.status = 'rejected';
        leave.approver = req.user.id;
        leave.approverComments = comments;
        leave.approvedAt = new Date();
        await leave.save();

        // Create audit log
        await createAuditLog({
            action: 'leave:reject',
            performedBy: req.user.id,
            description: `Rejected leave for ${leave.employee.name}`,
            targetModel: 'Leave',
            targetId: leave._id,
            ipAddress: req.ip,
        });

        await leave.populate('approver', 'name email');

        res.status(200).json({
            success: true,
            message: 'Leave rejected successfully',
            leave,
        });
    } catch (error) {
        console.error('Reject leave error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
        });
    }
};

/**
 * @desc    Get leave statistics
 * @route   GET /api/leaves/stats
 * @access  Private
 */
const getLeaveStats = async (req, res) => {
    try {
        const userRole = req.user.role.name;
        let query = {};

        if (userRole === 'Employee') {
            query.employee = req.user.id;
        } else if (userRole === 'Manager') {
            const teamMembers = await User.find({
                department: req.user.department,
                isDeleted: false,
            }).select('_id');

            const teamMemberIds = teamMembers.map(member => member._id);
            query.employee = { $in: teamMemberIds };
        }

        const totalLeaves = await Leave.countDocuments(query);
        const pendingLeaves = await Leave.countDocuments({ ...query, status: 'pending' });
        const approvedLeaves = await Leave.countDocuments({ ...query, status: 'approved' });
        const rejectedLeaves = await Leave.countDocuments({ ...query, status: 'rejected' });

        res.status(200).json({
            success: true,
            stats: {
                totalLeaves,
                pendingLeaves,
                approvedLeaves,
                rejectedLeaves,
            },
        });
    } catch (error) {
        console.error('Get leave stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
        });
    }
};

module.exports = {
    getLeaves,
    getMyLeaves,
    applyLeave,
    approveLeave,
    rejectLeave,
    getLeaveStats,
};
