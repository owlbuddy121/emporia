const User = require('../models/User');
const createAuditLog = require('../utils/auditLogger');

/**
 * @desc    Get all employees
 * @route   GET /api/employees
 * @access  Private (Super Admin, HR Admin)
 */
const getEmployees = async (req, res) => {
    try {
        const { search, department, role, status, page = 1, limit = 10 } = req.query;

        // Build query
        const query = { isDeleted: false };

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
            ];
        }

        if (department) {
            query.department = department;
        }

        if (role) {
            query.role = role;
        }

        if (status) {
            query.status = status;
        }

        // Execute query with pagination
        const employees = await User.find(query)
            .populate('role', 'name')
            .populate('department', 'name')
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort({ createdAt: -1 });

        const count = await User.countDocuments(query);

        res.status(200).json({
            success: true,
            count,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            employees,
        });
    } catch (error) {
        console.error('Get employees error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
        });
    }
};

/**
 * @desc    Get single employee
 * @route   GET /api/employees/:id
 * @access  Private
 */
const getEmployee = async (req, res) => {
    try {
        const employee = await User.findById(req.params.id)
            .populate('role')
            .populate('department');

        if (!employee || employee.isDeleted) {
            return res.status(404).json({
                success: false,
                message: 'Employee not found',
            });
        }

        res.status(200).json({
            success: true,
            employee,
        });
    } catch (error) {
        console.error('Get employee error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
        });
    }
};

/**
 * @desc    Create employee
 * @route   POST /api/employees
 * @access  Private (Super Admin, HR Admin)
 */
const createEmployee = async (req, res) => {
    try {
        const { name, email, password, role, department, phone, address, status } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User with this email already exists',
            });
        }

        // Create employee
        const employee = await User.create({
            name,
            email,
            password,
            role,
            department,
            phone,
            address,
            status: status || 'active',
        });

        // Create audit log
        await createAuditLog({
            action: 'employee:create',
            performedBy: req.user.id,
            description: `Created employee ${name}`,
            targetModel: 'User',
            targetId: employee._id,
            ipAddress: req.ip,
        });

        // Populate fields
        await employee.populate('role');
        await employee.populate('department');

        res.status(201).json({
            success: true,
            message: 'Employee created successfully',
            employee,
        });
    } catch (error) {
        console.error('Create employee error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
        });
    }
};

/**
 * @desc    Update employee
 * @route   PUT /api/employees/:id
 * @access  Private (Super Admin, HR Admin)
 */
const updateEmployee = async (req, res) => {
    try {
        const { name, email, role, department, phone, address, status, profilePicture } = req.body;

        let employee = await User.findById(req.params.id);

        if (!employee || employee.isDeleted) {
            return res.status(404).json({
                success: false,
                message: 'Employee not found',
            });
        }

        // Update fields
        if (name) employee.name = name;
        if (email) employee.email = email;
        if (role) employee.role = role;
        if (department) employee.department = department;
        if (phone) employee.phone = phone;
        if (address) employee.address = address;
        if (status) employee.status = status;
        if (profilePicture) employee.profilePicture = profilePicture;

        await employee.save();

        // Create audit log
        await createAuditLog({
            action: 'employee:update',
            performedBy: req.user.id,
            description: `Updated employee ${employee.name}`,
            targetModel: 'User',
            targetId: employee._id,
            metadata: req.body,
            ipAddress: req.ip,
        });

        // Populate fields
        await employee.populate('role');
        await employee.populate('department');

        res.status(200).json({
            success: true,
            message: 'Employee updated successfully',
            employee,
        });
    } catch (error) {
        console.error('Update employee error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
        });
    }
};

/**
 * @desc    Delete employee (soft delete)
 * @route   DELETE /api/employees/:id
 * @access  Private (Super Admin, HR Admin)
 */
const deleteEmployee = async (req, res) => {
    try {
        const employee = await User.findById(req.params.id);

        if (!employee || employee.isDeleted) {
            return res.status(404).json({
                success: false,
                message: 'Employee not found',
            });
        }

        // Soft delete
        employee.isDeleted = true;
        employee.status = 'inactive';
        await employee.save();

        // Create audit log
        await createAuditLog({
            action: 'employee:delete',
            performedBy: req.user.id,
            description: `Deleted employee ${employee.name}`,
            targetModel: 'User',
            targetId: employee._id,
            ipAddress: req.ip,
        });

        res.status(200).json({
            success: true,
            message: 'Employee deleted successfully',
        });
    } catch (error) {
        console.error('Delete employee error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
        });
    }
};

/**
 * @desc    Get dashboard stats
 * @route   GET /api/employees/stats/dashboard
 * @access  Private
 */
const getDashboardStats = async (req, res) => {
    try {
        const totalEmployees = await User.countDocuments({ isDeleted: false });
        const activeEmployees = await User.countDocuments({ isDeleted: false, status: 'active' });
        const inactiveEmployees = await User.countDocuments({ isDeleted: false, status: 'inactive' });

        // Get department-wise count
        const departmentStats = await User.aggregate([
            { $match: { isDeleted: false } },
            {
                $group: {
                    _id: '$department',
                    count: { $sum: 1 },
                },
            },
            {
                $lookup: {
                    from: 'departments',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'department',
                },
            },
            { $unwind: '$department' },
            {
                $project: {
                    name: '$department.name',
                    count: 1,
                },
            },
        ]);

        res.status(200).json({
            success: true,
            stats: {
                totalEmployees,
                activeEmployees,
                inactiveEmployees,
                departmentStats,
            },
        });
    } catch (error) {
        console.error('Get dashboard stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
        });
    }
};

module.exports = {
    getEmployees,
    getEmployee,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    getDashboardStats,
};
