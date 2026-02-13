const User = require('../models/User');
const Department = require('../models/Department');
const Leave = require('../models/Leave');

/**
 * @desc    Get comprehensive employee report
 * @route   GET /api/reports/employees
 * @access  Private (Admin only)
 */
const getEmployeeReport = async (req, res) => {
    try {
        const employees = await User.find({ isDeleted: false })
            .populate('department', 'name')
            .populate('role', 'name')
            .select('name email status createdAt');

        const reportData = employees.map(emp => ({
            Name: emp.name,
            Email: emp.email,
            Department: emp.department?.name || 'N/A',
            Role: emp.role?.name || 'N/A',
            Status: emp.status,
            Joined: new Date(emp.createdAt).toLocaleDateString()
        }));

        res.status(200).json({
            success: true,
            data: reportData
        });
    } catch (error) {
        console.error('Employee report error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

/**
 * @desc    Get department distribution report
 * @route   GET /api/reports/departments
 * @access  Private (Admin only)
 */
const getDepartmentReport = async (req, res) => {
    try {
        const departments = await Department.find();

        const reportData = await Promise.all(departments.map(async (dept) => {
            const count = await User.countDocuments({ department: dept._id, isDeleted: false });
            return {
                Department: dept.name,
                EmployeeCount: count
            };
        }));

        res.status(200).json({
            success: true,
            data: reportData
        });
    } catch (error) {
        console.error('Department report error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

/**
 * @desc    Get leave trends report
 * @route   GET /api/reports/leaves
 * @access  Private (Admin only)
 */
const getLeaveReport = async (req, res) => {
    try {
        const leaves = await Leave.find()
            .populate('employee', 'name')
            .populate('approver', 'name')
            .select('leaveType startDate endDate status');

        const reportData = leaves.map(leave => ({
            Employee: leave.employee?.name || 'Unknown',
            Type: leave.leaveType,
            Start: new Date(leave.startDate).toLocaleDateString(),
            End: new Date(leave.endDate).toLocaleDateString(),
            Status: leave.status,
            Approver: leave.approver?.name || 'N/A'
        }));

        res.status(200).json({
            success: true,
            data: reportData
        });
    } catch (error) {
        console.error('Leave report error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

module.exports = {
    getEmployeeReport,
    getDepartmentReport,
    getLeaveReport
};
