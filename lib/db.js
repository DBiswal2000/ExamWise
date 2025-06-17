import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    throw new Error('Please define MONGODB_URI in your .env.local file');
}

export async function connectDB() {
    if (mongoose.connection.readyState === 1) {
        console.log('Already connected to MongoDB');
        return;
    }

    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        throw error;
    }
}
