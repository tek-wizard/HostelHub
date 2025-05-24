import mongoose from "mongoose";

const connectMongoDB = async () => {
    try {
        // Use environment variable or default local MongoDB
        const mongoURI = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/hostelhub';
        
        console.log('Attempting to connect to MongoDB...');
        console.log('MongoDB URI:', mongoURI.replace(/\/\/.*@/, '//***:***@')); // Hide credentials in logs
        
        const connection = await mongoose.connect(mongoURI);
        console.log(`✅ MongoDB connected successfully: ${connection.connection.host}`);
        console.log(`Database: ${connection.connection.name}`);
    } catch (error) {
        console.error(`❌ Error connecting to MongoDB: ${error.message}`);
        console.error('Make sure MongoDB is running on your local machine or check your connection string');
        
        // Don't exit the process, just log the error
        // process.exit(1);
    }
}

export default connectMongoDB; 