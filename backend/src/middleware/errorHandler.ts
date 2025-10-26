import { Request, Response, NextFunction } from 'express';
import { Error } from 'mongoose';

interface CustomError extends Error {
    statusCode?: number;
    errors?: { [key: string]: any };
}

export const errorHandler = (err: CustomError, req: Request, res: Response, next: NextFunction) => {
    console.error(err);

    // Mongoose validation error
    if (err instanceof Error.ValidationError) {
        return res.status(400).json({
            message: 'Validation Error',
            errors: Object.values(err.errors).map(e => e.message)
        });
    }

    // Mongoose CastError (invalid ID)
    if (err instanceof Error.CastError) {
        return res.status(400).json({
            message: 'Invalid ID format'
        });
    }

    // Default error
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        message: err.message || 'Internal Server Error'
    });
};