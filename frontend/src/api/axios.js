import axios from 'axios';

const api = axios.create({
    // In production, we use the subdirectory /api handled by Nginx proxy
    // In development, we use the env variable or localhost
    baseURL: import.meta.env.PROD
        ? '/api'
        : (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'),
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
