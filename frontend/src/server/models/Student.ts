import mongoose from 'mongoose';

export interface IStudent extends mongoose.Document {
  name: string;
  class: string;
  phoneNumber: string;
  feeStatus: 'paid' | 'unpaid';
  admissionDate: Date;
  createdAt?: Date;
  updatedAt?: Date;
  feeRecords?: mongoose.Types.ObjectId[];
}

const studentSchema = new mongoose.Schema<IStudent>({
  name: { type: String, required: true },
  class: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  feeStatus: { type: String, enum: ['paid', 'unpaid'], default: 'unpaid' },
  admissionDate: { type: Date, default: Date.now }
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

studentSchema.virtual('feeRecords', {
  ref: 'FeeRecord',
  localField: '_id',
  foreignField: 'student'
});

export const Student = mongoose.models.Student || mongoose.model<IStudent>('Student', studentSchema);
