import mongoose from "mongoose";

const connectMongoDB = async () => {
    try {
        const mongoURI = process.env.MONGO_URI;        
        const connection = await mongoose.connect(mongoURI);
        // MongoDB connected successfully
    } catch (error) {
        throw new Error(`Failed to connect to MongoDB: ${error.message}`);
    }
}

export default connectMongoDB; 