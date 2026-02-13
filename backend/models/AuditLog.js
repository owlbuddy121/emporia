const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
    action: {
        type: String,
        required: true,
        trim: true,
    },
    performedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    targetModel: {
        type: String,
        trim: true,
    },
    targetId: {
        type: mongoose.Schema.Types.ObjectId,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    metadata: {
        type: mongoose.Schema.Types.Mixed,
    },
    ipAddress: {
        type: String,
        trim: true,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('AuditLog', auditLogSchema);
