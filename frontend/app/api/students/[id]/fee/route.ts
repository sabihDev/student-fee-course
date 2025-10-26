import { NextResponse } from 'next/server';
import { connectToDatabase } from '../../../../../src/server/db/mongoose';
import { Student } from '../../../../../src/server/models/Student';
import { FeeRecord } from '../../../../../src/server/models/FeeRecord';
import mongoose from 'mongoose';

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase();
    const { id } = params;
    const body = await req.json();
    const { month, year, amount, feeStatus, feeId } = body;

    if (feeId) {
      // update existing fee record
      const feeRecord = await FeeRecord.findById(feeId);
      if (!feeRecord) return NextResponse.json({ message: 'Fee record not found' }, { status: 404 });
      if (feeRecord.student.toString() !== id) return NextResponse.json({ message: 'Not allowed' }, { status: 403 });
      feeRecord.status = feeStatus;
      feeRecord.paidAt = feeStatus === 'paid' ? new Date() : null;
      await feeRecord.save();
      return NextResponse.json({ success: true, data: feeRecord });
    }

    if (!month || !year || !amount || !feeStatus) {
      return NextResponse.json({ message: 'Missing fields' }, { status: 400 });
    }

    const student = await Student.findById(id);
    if (!student) return NextResponse.json({ message: 'Student not found' }, { status: 404 });

    const feeRecord = new FeeRecord({ student: id, month, year, amount, status: feeStatus, paidAt: feeStatus === 'paid' ? new Date() : null });
    const [saved] = await Promise.all([feeRecord.save(), Student.findByIdAndUpdate(id, { feeStatus: feeStatus === 'paid' ? 'paid' : student.feeStatus }, { new: true })]);
    await saved.populate('student');
    return NextResponse.json({ success: true, data: saved });
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
