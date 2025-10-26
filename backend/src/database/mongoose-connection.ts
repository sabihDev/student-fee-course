import { log } from 'console';
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/student_fee_db';
log(MONGODB_URI);
interface MongoDBOptions {
    uri: string;
    retryAttempts?: number;
    retryDelay?: number;
}

export const connectToMongoDB = async (options: MongoDBOptions = { uri: MONGODB_URI }): Promise<void> => {
    const { uri, retryAttempts = 3, retryDelay = 5000 } = options;

    let attempts = 0;
    while (attempts < retryAttempts) {
        try {
            await mongoose.connect(uri, {
                serverSelectionTimeoutMS: 5000,
                socketTimeoutMS: 45000,
                maxPoolSize: 10,
            });
            console.log('Connected to MongoDB successfully');
            return;
        } catch (error) {
            attempts++;
            console.error(`MongoDB connection attempt ${attempts} failed:`, error);
            if (attempts === retryAttempts) {
                console.error('All connection attempts failed');
                throw error;
            }
            await new Promise(resolve => setTimeout(resolve, retryDelay));
        }
    }
};

export const disconnectFromMongoDB = async (): Promise<void> => {
    try {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    } catch (error) {
        console.error('Error disconnecting from MongoDB:', error instanceof Error ? error.message : error);
        throw error;
    }
};

// MongoDB connection event handlers
mongoose.connection.on('error', (error: Error) => {
    console.error('MongoDB connection error:', error.message);
});

mongoose.connection.on('disconnected', () => {
    console.log('MongoDB disconnected');
});

mongoose.connection.on('connected', () => {
    console.log('MongoDB connected');
});

mongoose.connection.on('reconnected', () => {
    console.log('MongoDB reconnected');
});

// Handle process termination
process.on('SIGINT', async () => {
    try {
        await disconnectFromMongoDB();
        process.exit(0);
    } catch (error) {
        console.error('Error during graceful shutdown:', error instanceof Error ? error.message : error);
        process.exit(1);
    }
});