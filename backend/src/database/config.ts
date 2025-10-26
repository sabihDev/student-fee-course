export interface MongoDBConfig {
    uri: string;
    options: {
        retryAttempts: number;
        retryDelay: number;
        serverSelectionTimeoutMS: number;
        socketTimeoutMS: number;
        maxPoolSize: number;
    };
}

const config: MongoDBConfig = {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/student_fee_db',
    options: {
        retryAttempts: 3,
        retryDelay: 5000,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        maxPoolSize: 10,
    }
};

export default config;