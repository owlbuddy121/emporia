const express = require('express');
const router = express.Router();
const Attendance = require('../models/Attendance');
const { protect } = require('../middleware/auth');

// Get attendance statistics (Month/Employee level)
router.get('/stats', protect, async (req, res) => {
    try {
        const { month, year, department, role } = req.query;
        const targetYear = parseInt(year) || new Date().getFullYear();
        const targetMonth = parseInt(month) || new Date().getMonth() + 1; // 1-12

        const startDate = new Date(targetYear, targetMonth - 1, 1);
        const endDate = new Date(targetYear, targetMonth, 0, 23, 59, 59, 999);

        // Match stage for aggregations
        const matchStage = {
            date: { $gte: startDate, $lte: endDate }
        };

        // If not admin/hr, restrict to own data
        // For now, let's assume if department/role filters are present, it's an admin/manager request
        // We need to fetch users matching the filters if provided

        let userFilter = {};
        if (department) userFilter.department = department; // ID
        if (role) userFilter.role = role; // ID

        // If filters exist, find matching user IDs first
        let allowedUserIds = [];
        if (Object.keys(userFilter).length > 0) {
            const User = require('../models/User');
            const users = await User.find(userFilter).select('_id');
            allowedUserIds = users.map(u => u._id);
            matchStage.user = { $in: allowedUserIds };
        }

        // Daily Attendance Trend (for Chart)
        const dailyTrend = await Attendance.aggregate([
            { $match: matchStage },
            {
                $group: {
                    _id: { $dayOfMonth: "$date" },
                    present: {
                        $sum: { $cond: [{ $ne: ["$status", "Absent"] }, 1, 0] }
                    },
                    absent: {
                        $sum: { $cond: [{ $eq: ["$status", "Absent"] }, 1, 0] }
                    },
                    late: {
                        $sum: { $cond: [{ $eq: ["$status", "Half Day"] }, 1, 0] }
                    }
                }
            },
            { $sort: { "_id": 1 } }
        ]);

        // Employee Level Stats
        const employeeStats = await Attendance.aggregate([
            { $match: matchStage },
            {
                $group: {
                    _id: "$user",
                    totalDays: { $sum: 1 },
                    daysPresent: {
                        $sum: { $cond: [{ $ne: ["$status", "Absent"] }, 1, 0] }
                    },
                    totalDuration: { $sum: "$duration" },
                    avgDuration: { $avg: "$duration" }
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "_id",
                    foreignField: "_id",
                    as: "userInfo"
                }
            },
            { $unwind: "$userInfo" },
            {
                $project: {
                    name: "$userInfo.name",
                    email: "$userInfo.email",
                    daysPresent: 1,
                    totalDuration: 1,
                    avgDuration: { $round: ["$avgDuration", 0] },
                    attendancePercentage: {
                        $multiply: [
                            { $divide: ["$daysPresent", { $dayOfMonth: endDate }] }, // Approximate based on total days in month
                            100
                        ]
                    }
                }
            },
            { $sort: { daysPresent: -1 } }
        ]);

        res.json({
            period: { month: targetMonth, year: targetYear },
            dailyTrend,
            employeeStats
        });

    } catch (error) {
        console.error('Stats error:', error);
        res.status(500).json({ message: error.message });
    }
});

// Get current user's status for today
router.get('/status', protect, async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const attendance = await Attendance.findOne({
            user: req.user._id,
            date: today
        });

        if (!attendance) {
            return res.json({ status: 'not_punched_in' });
        }

        if (attendance.punchOut) {
            return res.json({
                status: 'punched_out',
                data: attendance
            });
        }

        return res.json({
            status: 'punched_in',
            data: attendance
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Punch In
router.post('/punch-in', protect, async (req, res) => {
    try {
        const { scrumNote } = req.body;

        if (!scrumNote) {
            return res.status(400).json({ message: 'Scrum note is required for punch in.' });
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Check if already punched in
        const existing = await Attendance.findOne({
            user: req.user._id,
            date: today
        });

        if (existing) {
            return res.status(400).json({ message: 'You have already punched in for today.' });
        }

        const attendance = new Attendance({
            user: req.user._id,
            date: today,
            punchIn: new Date(),
            scrumNote,
            status: 'Present'
        });

        await attendance.save();

        res.status(201).json({
            message: 'Punched in successfully',
            attendance
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Punch Out
router.post('/punch-out', protect, async (req, res) => {
    try {
        const { workReport } = req.body;

        if (!workReport) {
            return res.status(400).json({ message: 'Work report is required for punch out.' });
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const attendance = await Attendance.findOne({
            user: req.user._id,
            date: today
        });

        if (!attendance) {
            return res.status(404).json({ message: 'No punch-in record found for today.' });
        }

        if (attendance.punchOut) {
            return res.status(400).json({ message: 'You have already punched out for today.' });
        }

        attendance.punchOut = new Date();
        attendance.workReport = workReport;

        // Calculate duration in minutes
        const diffMs = attendance.punchOut - attendance.punchIn;
        attendance.duration = Math.round(diffMs / 60000);

        await attendance.save();

        res.json({
            message: 'Punched out successfully',
            attendance
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get all attendance records (Admin/Manager)
router.get('/', protect, async (req, res) => {
    try {
        // Basic filtering can be added here (date range, user, etc.)
        const { date } = req.query;
        let query = {};

        // If not admin/hr, only show own records or team records (keep simple for now: own or all if admin)
        // For this iteration, let's allow viewing all if having permission
        /* 
        if (!req.user.permissions.includes('attendance:view_all')) {
             query.user = req.user._id;
        }
        */

        if (date) {
            const queryDate = new Date(date);
            queryDate.setHours(0, 0, 0, 0);
            query.date = queryDate;
        }

        const records = await Attendance.find(query)
            .populate('user', 'name email role department')
            .sort({ date: -1, punchIn: -1 });

        res.json({ records });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
