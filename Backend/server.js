import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors'; 

import sessionRoutes from './routes/session.Routes.js';
import connectMongoDB from './db/connectMongoDb.js';

dotenv.config();
const app = express();
app.use(cors());


app.use(express.json());


app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    console.log('Request Body:', req.body);
    next();
});

const PORT = process.env.PORT || 8000;

app.use("/api/sessions", sessionRoutes);


app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!', error: err.message });
});


const startServer = async () => {
    try {
        await connectMongoDB();
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();