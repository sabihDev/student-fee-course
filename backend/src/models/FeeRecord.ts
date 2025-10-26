import mongoose from 'mongoose';
import { IStudent } from './Student';

import { Document } from 'mongoose';

export interface IFeeRecord extends Document {
    student: mongoose.Types.ObjectId | IStudent;
    month: string;
    year: number;
    amount: number;
    status: 'paid' | 'unpaid';
    paidAt?: Date;
    createdAt?: Date;
    updatedAt?: Date;
}

const feeRecordSchema = new mongoose.Schema<IFeeRecord>({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true
    },
    month: {
        type: String,
        required: true
    },
    year: {
        type: Number,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['paid', 'unpaid'],
        default: 'unpaid'
    },
    paidAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

export const FeeRecord = mongoose.model<IFeeRecord>('FeeRecord', feeRecordSchema);