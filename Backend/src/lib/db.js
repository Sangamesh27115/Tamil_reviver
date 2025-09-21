import mongoose from 'mongoose';

export const connectDB = async (mongo_url) => {
    try {
        const conn = await mongoose.connect(mongo_url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
            // Add indexes for better query performance
            autoIndex: true,
            // Add connection pool for better performance
            maxPoolSize: 10,
            // Add retry writes for better reliability
            retryWrites: true
        });
        
        // Create indexes for better query performance
        await Promise.all([
            mongoose.model('User').createIndexes(),
            mongoose.model('Word').createIndexes(),
            mongoose.model('GameSession').createIndexes(),
            mongoose.model('Task').createIndexes(),
            mongoose.model('Achievement').createIndexes(),
            mongoose.model('Reward').createIndexes()
        ]);
        
        console.log(`✅ MongoDB connected to ${conn.connection.host}`);
        return conn;
    } catch (error) {
        console.log("❌ Error connecting to MongoDB:", error.message);
        throw error;
    }
}