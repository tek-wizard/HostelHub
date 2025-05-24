import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
    baseURL: 'http://localhost:8000/api',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Request interceptor for authentication (if needed in future)
api.interceptors.request.use(
    (config) => config,
    (error) => Promise.reject(error)
);

// Response interceptor for common error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const message = error.response?.data?.message || error.message || 'Something went wrong';
        return Promise.reject(new Error(message));
    }
);

// API functions
export const sessionAPI = {
    getMachineStatus: () => api.get('/sessions/machine-status'),
    
    createSession: (sessionData) => api.post('/sessions/create', sessionData),
    
    deleteSession: (sessionId) => api.delete(`/sessions/${sessionId}`),
    
    getAllSessions: () => api.get('/sessions/all'),
    
    getActiveSessions: () => api.get('/sessions/active')
};

export default api; 