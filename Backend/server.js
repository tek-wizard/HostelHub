import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors'; 

import sessionRoutes from './routes/session.Routes.js';
import connectMongoDB from './db/connectMongoDB.js';

dotenv.config();
const app = express();

// CORS configuration for production and development
const corsOptions = {
  origin: [
    'http://localhost:5173', // Your Vite dev server
    'http://localhost:8000',
    'https://hostel-hub-alpha.vercel.app'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.use(express.json());

// Define routes BEFORE starting server
app.use("/api/sessions", sessionRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.status(200).json({ 
        message: 'HostelHub API is running!', 
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

const PORT = process.env.PORT || 8000;

const startServer = async () => {
    try {
        await connectMongoDB();
        // Only ONE app.listen() call here
        app.listen(PORT, '0.0.0.0', () => {
            console.log(`🚀 Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();
