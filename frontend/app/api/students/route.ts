import { NextResponse } from 'next/server';
import { connectToDatabase } from '../../../src/server/db/mongoose';
import { Student } from '../../../src/server/models/Student';
import { FeeRecord } from '../../../src/server/models/FeeRecord';

export async function GET(req: Request) {
  await connectToDatabase();
  const url = new URL(req.url);
  const params = url.searchParams;

  const filter: any = {};
  if (params.get('class')) filter.class = params.get('class');
  if (params.get('feeStatus')) filter.feeStatus = params.get('feeStatus');
  if (params.get('month') && params.get('year')) {
    // we'll populate feeRecords later on client if needed
  }

  const students = await Student.find(filter).populate('feeRecords').exec();
  return NextResponse.json(students);
}

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const { name, class: studentClass, phoneNumber } = body;
    const student = new Student({ name, class: studentClass, phoneNumber, feeStatus: 'unpaid', admissionDate: new Date() });
    await student.save();
    return NextResponse.json(student, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ message: err.message || 'Error creating student' }, { status: 500 });
  }
}
