const mongoose = require('mongoose');
const Attendance = require('../models/Attendance');
const User = require('../models/User');
require('dotenv').config();

const seedAttendance = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to DB');

        // Clear existing attendance
        await Attendance.deleteMany({});
        console.log('Cleared existing attendance');

        const users = await User.find({ role: { $ne: null } });
        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth(); // Current month

        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const attendanceRecords = [];

        console.log(`Seeding for ${users.length} users over ${daysInMonth} days...`);

        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);

            // Skip weekends (randomly)
            if (date.getDay() === 0 || date.getDay() === 6) {
                if (Math.random() > 0.2) continue; // 20% chance to work on weekend
            }

            // Don't seed future days
            if (date > today) break;

            for (const user of users) {
                // Randomize status
                const rand = Math.random();
                let status = 'Present';
                let punchIn = new Date(date);
                punchIn.setHours(9 + Math.random(), Math.random() * 60, 0); // 9:00 - 10:00

                let punchOut = new Date(date);
                punchOut.setHours(17 + Math.random(), Math.random() * 60, 0); // 17:00 - 18:00

                let duration = Math.round((punchOut - punchIn) / 60000);

                if (rand > 0.9) {
                    status = 'Absent';
                    punchIn = null;
                    punchOut = null;
                    duration = 0;
                } else if (rand > 0.8) {
                    status = 'Half Day';
                    punchOut.setHours(13, 0, 0);
                    duration = Math.round((punchOut - punchIn) / 60000);
                }

                if (status !== 'Absent') {
                    attendanceRecords.push({
                        user: user._id,
                        date: date,
                        punchIn: punchIn,
                        punchOut: punchOut,
                        scrumNote: 'Daily standup',
                        workReport: 'Completed tasks',
                        duration: duration,
                        status: status
                    });
                }
            }
        }

        await Attendance.insertMany(attendanceRecords);
        console.log(`✅ Seeded ${attendanceRecords.length} attendance records`);

        await mongoose.disconnect();
    } catch (error) {
        console.error('Error:', error);
    }
};

seedAttendance();
