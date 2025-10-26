import { connectToDatabase } from '../../../src/server/db/mongoose';
import { Student } from '../../../src/server/models/Student';
import { FeeRecord } from '../../../src/server/models/FeeRecord';

export async function createTestData() {
  try {
    await connectToDatabase();

    // Create a test student
    const student = new Student({
      name: 'Test Student',
      class: '10th',
      phoneNumber: '1234567890',
      feeStatus: 'unpaid',
      admissionDate: new Date()
    });

    await student.save();

    // Create a test fee record
    const feeRecord = new FeeRecord({
      student: student._id,
      month: 'January',
      year: 2025,
      amount: 1000,
      status: 'unpaid'
    });

    await feeRecord.save();

    return { student, feeRecord };
  } catch (error) {
    console.error('Error creating test data:', error);
    throw error;
  }
}