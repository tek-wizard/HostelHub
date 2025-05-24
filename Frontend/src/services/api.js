import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
    baseURL: 'http://localhost:8000/api',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Response interceptor for logging and error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        return Promise.reject(error);
    }
);

// API functions
export const sessionAPI = {
    // Get machine status
    getMachineStatus: async () => {
        try {
            const response = await api.get('/sessions/machine-status');
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to fetch machine status');
        }
    },

    // Create new session
    createSession: async (sessionData) => {
        try {
            const response = await api.post('/sessions/create', sessionData);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to create session');
        }
    },

    // Delete session
    deleteSession: async (sessionId) => {
        try {
            const response = await api.delete(`/sessions/${sessionId}`);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to delete session');
        }
    },

    // Get all sessions
    getAllSessions: async () => {
        try {
            const response = await api.get('/sessions/all');
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to fetch sessions');
        }
    },

    // Get active sessions
    getActiveSessions: async () => {
        try {
            const response = await api.get('/sessions/active');
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to fetch active sessions');
        }
    }
};

export default api; 