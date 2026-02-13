const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    punchIn: {
        type: Date,
        required: true
    },
    punchOut: {
        type: Date
    },
    scrumNote: {
        type: String,
        required: true
    },
    workReport: {
        type: String
    },
    duration: {
        type: Number, // In minutes
        default: 0
    },
    status: {
        type: String,
        enum: ['Present', 'Half Day', 'Absent', 'On Leave'],
        default: 'Present'
    }
}, {
    timestamps: true
});

// Index for efficient querying by user and date
attendanceSchema.index({ user: 1, date: 1 });

module.exports = mongoose.model('Attendance', attendanceSchema);
