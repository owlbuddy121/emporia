const mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const verifyPassword = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);

        const user = await User.findOne({ email: 'admin@emporia.com' }).select('+password');
        if (user) {
            console.log('User found:', user.email);
            const isMatch = await bcrypt.compare('admin123', user.password);
            console.log('Password match:', isMatch);
        } else {
            console.log('User not found');
        }
        await mongoose.disconnect();
    } catch (error) {
        console.error('Error:', error);
    }
};

verifyPassword();
