/**
 * Role-Based Access Control Middleware
 * Check if user has required permissions
 */
const authorize = (...permissions) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized to access this route',
            });
        }

        // Get user's permissions from role
        const userPermissions = req.user.role.permissions || [];

        // Check if user has any of the required permissions
        const hasPermission = permissions.some(permission =>
            userPermissions.includes(permission)
        );

        if (!hasPermission) {
            return res.status(403).json({
                success: false,
                message: 'You do not have permission to perform this action',
            });
        }

        next();
    };
};

/**
 * Check if user has specific role
 */
const authorizeRole = (...roleNames) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized to access this route',
            });
        }

        if (!roleNames.includes(req.user.role.name)) {
            return res.status(403).json({
                success: false,
                message: 'You do not have permission to perform this action',
            });
        }

        next();
    };
};

module.exports = { authorize, authorizeRole };
