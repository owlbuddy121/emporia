const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const checkUser = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to DB');

        const user = await User.findOne({ email: 'admin@emporia.com' }).select('+password');
        if (user) {
            console.log('User found:', user.email);
            console.log('Password hash:', user.password);
            console.log('Status:', user.status);
            console.log('isDeleted:', user.isDeleted);
        } else {
            console.log('User not found');
        }
        await mongoose.disconnect();
    } catch (error) {
        console.error('Error:', error);
    }
};

checkUser();
