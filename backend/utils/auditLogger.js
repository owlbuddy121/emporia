const AuditLog = require('../models/AuditLog');

/**
 * Create an audit log entry
 * @param {String} action - Action performed
 * @param {ObjectId} performedBy - User who performed the action
 * @param {String} description - Description of the action
 * @param {String} targetModel - Model name of the target
 * @param {ObjectId} targetId - ID of the target document
 * @param {Object} metadata - Additional metadata
 * @param {String} ipAddress - IP address of the user
 */
const createAuditLog = async ({
    action,
    performedBy,
    description,
    targetModel = null,
    targetId = null,
    metadata = null,
    ipAddress = null,
}) => {
    try {
        await AuditLog.create({
            action,
            performedBy,
            description,
            targetModel,
            targetId,
            metadata,
            ipAddress,
        });
    } catch (error) {
        console.error('Error creating audit log:', error);
    }
};

module.exports = createAuditLog;
