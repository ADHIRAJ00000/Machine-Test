const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/userModel');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const checkAdmin = async () => {
    try {
        const admin = await User.findOne({ email: 'admin@example.com' });
        if (admin) {
            console.log('Admin found:', admin.email);
            console.log('Role:', admin.role);
            console.log('Password hash:', admin.password);

            const isMatch = await admin.matchPassword('admin123password');
            console.log('Password match test (admin123password):', isMatch);
        } else {
            console.log('Admin not found in database.');
        }
        process.exit();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

checkAdmin();
