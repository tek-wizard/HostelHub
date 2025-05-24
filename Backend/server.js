import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors'; 

import sessionRoutes from './routes/session.Routes.js';
import connectMongoDB from './db/connectMongoDB.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

app.use("/api/sessions", sessionRoutes);

app.use((err, req, res, next) => {
    res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

const startServer = async () => {
    try {
        await connectMongoDB();
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();