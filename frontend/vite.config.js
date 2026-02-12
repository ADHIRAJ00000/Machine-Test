import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        proxy: {
<<<<<<< HEAD
            '/api': 'http://localhost:5002',
=======
            '/api': 'https://machine-test-10.onrender.com',
>>>>>>> c5cb1bd4b96ab4c7275e81b709ca115f32511f6d
        },
    },
})
