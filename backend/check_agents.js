const mongoose = require('mongoose');
const User = require('./src/models/userModel');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

const checkAgents = async () => {
    await connectDB();
    const agents = await User.find({ role: 'agent' });
    console.log(`Found ${agents.length} agents.`);
    agents.forEach(agent => {
        console.log(`- ${agent.name} (${agent.email}) [${agent._id}]`);
    });
    process.exit();
};

checkAgents();
