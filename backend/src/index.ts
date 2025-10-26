import dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { Parser } from 'json2csv';
import studentRoutes from './routes/studentRoutes';
import { connectToMongoDB } from './database/mongoose-connection';
import { errorHandler } from './middleware/errorHandler';

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectToMongoDB()
    .catch((error: Error) => {
        console.error("Failed to start the server:", error);
        process.exit(1);
    });

// Routes
app.use('/api', studentRoutes);

// Error handling middleware
app.use(errorHandler);

// Global error handler for uncaught errors
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Unhandled Error:', err);
  res.status(500).json({
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason: any) => {
  console.error('Unhandled Promise rejection:', reason);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error: Error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});