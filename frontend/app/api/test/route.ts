import { NextResponse } from 'next/server';
import { createTestData } from '../../../src/server/test/createTestData';

export async function GET() {
  try {
    const testData = await createTestData();
    return NextResponse.json(testData);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}