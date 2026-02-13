const mongoose = require('mongoose');

const leaveSchema = new mongoose.Schema({
    employee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    leaveType: {
        type: String,
        enum: ['Paid Leave', 'Sick Leave', 'Casual Leave', 'Unpaid Leave'],
        required: [true, 'Please specify leave type'],
    },
    startDate: {
        type: Date,
        required: [true, 'Please provide start date'],
    },
    endDate: {
        type: Date,
        required: [true, 'Please provide end date'],
    },
    reason: {
        type: String,
        required: [true, 'Please provide a reason'],
        trim: true,
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending',
    },
    approver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    approverComments: {
        type: String,
        trim: true,
    },
    approvedAt: {
        type: Date,
    },
}, {
    timestamps: true,
});

// Calculate number of days
leaveSchema.virtual('numberOfDays').get(function () {
    const diffTime = Math.abs(this.endDate - this.startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
});

module.exports = mongoose.model('Leave', leaveSchema);
