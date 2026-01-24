const fs = require('fs');
const axios = require('axios');
const FormData = require('form-data');
const path = require('path');

const loginUrl = 'http://localhost:5002/api/users/login';
const uploadUrl = 'http://localhost:5002/api/upload';

const login = async () => {
    try {
        const res = await axios.post(loginUrl, {
            email: 'admin@example.com',
            password: 'admin123password'
        });
        return res.data.token;
    } catch (error) {
        console.error('Login failed:', error.message);
        process.exit(1);
    }
};

const uploadFile = async (token, filePath) => {
    const form = new FormData();
    form.append('file', fs.createReadStream(filePath));

    try {
        const res = await axios.post(uploadUrl, form, {
            headers: {
                ...form.getHeaders(),
                Authorization: `Bearer ${token}`
            }
        });
        console.log(`Upload ${filePath} Success:`, res.status, res.data);
    } catch (error) {
        console.error(`Upload ${filePath} Failed:`, error.response ? error.response.data : error.message);
    }
};

const run = async () => {
    const token = await login();
    console.log('Got token, proceeding to upload...');

    await uploadFile(token, path.join(__dirname, '../../valid.csv'));
    await uploadFile(token, path.join(__dirname, '../../invalid.csv'));
};

run();
