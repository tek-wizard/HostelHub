import axios from 'axios';

const API_BASE_URL = import.meta.env.PROD 
    ? "https://hostelhub-mnr8.onrender.com" 
    : "http://localhost:8000";

const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Request interceptor for debugging
api.interceptors.request.use(
    (config) => {
        if (import.meta.env.DEV) {
            console.log('API Request:', config.method?.toUpperCase(), config.url);
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor for common error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const message = error.response?.data?.message || error.message || 'Something went wrong';
        if (import.meta.env.DEV) {
            console.error('API Error:', message);
        }
        return Promise.reject(new Error(message));
    }
);

// API functions
export const sessionAPI = {
    getMachineStatus: () => api.get('/api/sessions/machine-status'),
    
    createSession: (sessionData) => api.post('/api/sessions/create', sessionData),
    
    deleteSession: (sessionId) => api.delete(`/api/sessions/${sessionId}`),
    
    getAllSessions: () => api.get('/api/sessions/all'),
    
    getActiveSessions: () => api.get('/api/sessions/active')
};

export default api; 