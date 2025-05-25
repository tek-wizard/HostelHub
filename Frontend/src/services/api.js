import axios from 'axios';

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

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
    getMachineStatus: () => api.get('/sessions/machine-status'),
    
    createSession: (sessionData) => api.post('/sessions/create', sessionData),
    
    deleteSession: (sessionId) => api.delete(`/sessions/${sessionId}`),
    
    getAllSessions: () => api.get('/sessions/all'),
    
    getActiveSessions: () => api.get('/sessions/active')
};

export default api; 