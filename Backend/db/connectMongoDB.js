import mongoose from "mongoose";

const connectMongoDB = async () => {
    try {
        const mongoURI = process.env.MONGO_URI;        
        const connection = await mongoose.connect(mongoURI);
        console.log(`MongoDB connected successfully: ${connection.connection.host}`);
    } catch (error) {
        console.error(`Error connecting to MongoDB: ${error.message}`);
    }
}

export default connectMongoDB; 