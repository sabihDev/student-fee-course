import { NextResponse } from 'next/server';
import { connectToDatabase } from '../../../../src/server/db/mongoose';
import { Student } from '../../../../src/server/models/Student';
import { FeeRecord } from '../../../../src/server/models/FeeRecord';
import mongoose from 'mongoose';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase();
    const { id } = params;
    if (!mongoose.isValidObjectId(id)) return NextResponse.json({ message: 'Invalid ID' }, { status: 400 });
    const student = await Student.findById(id).populate('feeRecords');
    if (!student) return NextResponse.json({ message: 'Not found' }, { status: 404 });
    return NextResponse.json(student);
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase();
    const { id } = params;
    await Student.findByIdAndDelete(id);
    await FeeRecord.deleteMany({ student: id });
    return NextResponse.json({ message: 'Deleted' });
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase();
    const { id } = params;
    const body = await req.json();
    const update = await Student.findByIdAndUpdate(id, body, { new: true });
    return NextResponse.json(update);
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
