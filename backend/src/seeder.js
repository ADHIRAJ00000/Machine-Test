const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/userModel');
const connectDB = require('./config/db');

dotenv.config();

connectDB();

const seedAdmin = async () => {
    try {
        await User.deleteMany({ role: 'admin' });

        const admin = await User.create({
            name: 'Admin User',
            email: 'admin@example.com',
            password: 'admin123password', // This will be hashed by the pre-save hook
            role: 'admin',
        });

        console.log('Admin User Created:', admin.email);
        process.exit();
    } catch (error) {
        console.error('Error seeding admin:', error.message);
        process.exit(1);
    }
};

seedAdmin();
