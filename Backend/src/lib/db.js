import mongoose from "mongoose";

export const connectDB = async (mongo_url) => {
    try {
         const conn = await mongoose.connect(mongo_url);
        console.log(`✅ MongoDB connected to ${conn.connection.host}`);
        return conn;
    } catch (error) {
        console.log("❌ Error connecting to MongoDB:", error.message);
        throw error; // Don't exit process, let the caller handle it
    }
}