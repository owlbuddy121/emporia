const Role = require('../models/Role');
const createAuditLog = require('../utils/auditLogger');

/**
 * @desc    Get all roles
 * @route   GET /api/roles
 * @access  Private
 */
const getRoles = async (req, res) => {
    try {
        const roles = await Role.find().sort({ name: 1 });

        res.status(200).json({
            success: true,
            count: roles.length,
            roles,
        });
    } catch (error) {
        console.error('Get roles error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
        });
    }
};

/**
 * @desc    Get single role
 * @route   GET /api/roles/:id
 * @access  Private
 */
const getRole = async (req, res) => {
    try {
        const role = await Role.findById(req.params.id);

        if (!role) {
            return res.status(404).json({
                success: false,
                message: 'Role not found',
            });
        }

        res.status(200).json({
            success: true,
            role,
        });
    } catch (error) {
        console.error('Get role error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
        });
    }
};

/**
 * @desc    Create role
 * @route   POST /api/roles
 * @access  Private (Super Admin only)
 */
const createRole = async (req, res) => {
    try {
        const { name, permissions, description } = req.body;

        // Check if role already exists
        const existingRole = await Role.findOne({ name });

        if (existingRole) {
            return res.status(400).json({
                success: false,
                message: 'Role with this name already exists',
            });
        }

        // Create role
        const role = await Role.create({
            name,
            permissions,
            description,
        });

        // Create audit log
        await createAuditLog({
            action: 'role:create',
            performedBy: req.user.id,
            description: `Created role ${name}`,
            targetModel: 'Role',
            targetId: role._id,
            ipAddress: req.ip,
        });

        res.status(201).json({
            success: true,
            message: 'Role created successfully',
            role,
        });
    } catch (error) {
        console.error('Create role error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
        });
    }
};

/**
 * @desc    Update role
 * @route   PUT /api/roles/:id
 * @access  Private (Super Admin only)
 */
const updateRole = async (req, res) => {
    try {
        const { name, permissions, description } = req.body;

        let role = await Role.findById(req.params.id);

        if (!role) {
            return res.status(404).json({
                success: false,
                message: 'Role not found',
            });
        }

        // Update fields
        if (name) role.name = name;
        if (permissions) role.permissions = permissions;
        if (description !== undefined) role.description = description;

        await role.save();

        // Create audit log
        await createAuditLog({
            action: 'role:update',
            performedBy: req.user.id,
            description: `Updated role ${role.name}`,
            targetModel: 'Role',
            targetId: role._id,
            metadata: req.body,
            ipAddress: req.ip,
        });

        res.status(200).json({
            success: true,
            message: 'Role updated successfully',
            role,
        });
    } catch (error) {
        console.error('Update role error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
        });
    }
};

/**
 * @desc    Delete role
 * @route   DELETE /api/roles/:id
 * @access  Private (Super Admin only)
 */
const deleteRole = async (req, res) => {
    try {
        const role = await Role.findById(req.params.id);

        if (!role) {
            return res.status(404).json({
                success: false,
                message: 'Role not found',
            });
        }

        await role.deleteOne();

        // Create audit log
        await createAuditLog({
            action: 'role:delete',
            performedBy: req.user.id,
            description: `Deleted role ${role.name}`,
            targetModel: 'Role',
            targetId: role._id,
            ipAddress: req.ip,
        });

        res.status(200).json({
            success: true,
            message: 'Role deleted successfully',
        });
    } catch (error) {
        console.error('Delete role error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
        });
    }
};

module.exports = {
    getRoles,
    getRole,
    createRole,
    updateRole,
    deleteRole,
};
