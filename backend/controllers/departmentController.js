const Department = require('../models/Department');
const createAuditLog = require('../utils/auditLogger');

/**
 * @desc    Get all departments
 * @route   GET /api/departments
 * @access  Private
 */
const getDepartments = async (req, res) => {
    try {
        const departments = await Department.find()
            .populate('manager', 'name email')
            .sort({ name: 1 });

        res.status(200).json({
            success: true,
            count: departments.length,
            departments,
        });
    } catch (error) {
        console.error('Get departments error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
        });
    }
};

/**
 * @desc    Get single department
 * @route   GET /api/departments/:id
 * @access  Private
 */
const getDepartment = async (req, res) => {
    try {
        const department = await Department.findById(req.params.id)
            .populate('manager', 'name email');

        if (!department) {
            return res.status(404).json({
                success: false,
                message: 'Department not found',
            });
        }

        res.status(200).json({
            success: true,
            department,
        });
    } catch (error) {
        console.error('Get department error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
        });
    }
};

/**
 * @desc    Create department
 * @route   POST /api/departments
 * @access  Private (Super Admin, HR Admin)
 */
const createDepartment = async (req, res) => {
    try {
        const { name, manager, description } = req.body;

        // Check if department already exists
        const existingDepartment = await Department.findOne({ name });

        if (existingDepartment) {
            return res.status(400).json({
                success: false,
                message: 'Department with this name already exists',
            });
        }

        // Create department
        const department = await Department.create({
            name,
            manager,
            description,
        });

        // Create audit log
        await createAuditLog({
            action: 'department:create',
            performedBy: req.user.id,
            description: `Created department ${name}`,
            targetModel: 'Department',
            targetId: department._id,
            ipAddress: req.ip,
        });

        await department.populate('manager', 'name email');

        res.status(201).json({
            success: true,
            message: 'Department created successfully',
            department,
        });
    } catch (error) {
        console.error('Create department error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
        });
    }
};

/**
 * @desc    Update department
 * @route   PUT /api/departments/:id
 * @access  Private (Super Admin, HR Admin)
 */
const updateDepartment = async (req, res) => {
    try {
        const { name, manager, description } = req.body;

        let department = await Department.findById(req.params.id);

        if (!department) {
            return res.status(404).json({
                success: false,
                message: 'Department not found',
            });
        }

        // Update fields
        if (name) department.name = name;
        if (manager !== undefined) department.manager = manager;
        if (description !== undefined) department.description = description;

        await department.save();

        // Create audit log
        await createAuditLog({
            action: 'department:update',
            performedBy: req.user.id,
            description: `Updated department ${department.name}`,
            targetModel: 'Department',
            targetId: department._id,
            metadata: req.body,
            ipAddress: req.ip,
        });

        await department.populate('manager', 'name email');

        res.status(200).json({
            success: true,
            message: 'Department updated successfully',
            department,
        });
    } catch (error) {
        console.error('Update department error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
        });
    }
};

/**
 * @desc    Delete department
 * @route   DELETE /api/departments/:id
 * @access  Private (Super Admin)
 */
const deleteDepartment = async (req, res) => {
    try {
        const department = await Department.findById(req.params.id);

        if (!department) {
            return res.status(404).json({
                success: false,
                message: 'Department not found',
            });
        }

        await department.deleteOne();

        // Create audit log
        await createAuditLog({
            action: 'department:delete',
            performedBy: req.user.id,
            description: `Deleted department ${department.name}`,
            targetModel: 'Department',
            targetId: department._id,
            ipAddress: req.ip,
        });

        res.status(200).json({
            success: true,
            message: 'Department deleted successfully',
        });
    } catch (error) {
        console.error('Delete department error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
        });
    }
};

module.exports = {
    getDepartments,
    getDepartment,
    createDepartment,
    updateDepartment,
    deleteDepartment,
};
