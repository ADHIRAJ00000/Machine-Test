import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL, // Defaults to current origin if undefined
});

// Optional: Add interceptors if needed later for auth tokens (though currently handled via headers in components)
// api.interceptors.request.use((config) => {
//     const userInfo = localStorage.getItem('userInfo')
//         ? JSON.parse(localStorage.getItem('userInfo'))
//         : null;
//     if (userInfo && userInfo.token) {
//         config.headers.Authorization = `Bearer ${userInfo.token}`;
//     }
//     return config;
// });

export default api;
