import { Student, classes, FeeRecord } from './types';

function generatePhoneNumber(): string {
  return `+92${Math.floor(Math.random() * 9000000000 + 1000000000)}`;
}

function generateMonthlyFees(startDate: Date): FeeRecord[] {
  const fees: FeeRecord[] = [];
  const currentDate = new Date();
  let date = new Date(startDate);
  
  while (date <= currentDate) {
    fees.push({
      month: date.toLocaleString('default', { month: 'long' }),
      year: date.getFullYear(),
      status: Math.random() > 0.3 ? 'paid' : 'unpaid',
      paidOn: Math.random() > 0.3 ? new Date(date.getTime() + Math.random() * 15 * 24 * 60 * 60 * 1000) : undefined,
      amount: 5000
    });
    date.setMonth(date.getMonth() + 1);
  }
  return fees;
}

function generateDummyData(): Student[] {
  const students: Student[] = [];
  const currentDate = new Date();
  
  for (let i = 0; i < 200; i++) {
    const admissionDate = new Date(
      currentDate.getFullYear() - Math.floor(Math.random() * 3),
      Math.floor(Math.random() * 12),
      Math.floor(Math.random() * 28) + 1
    );
    
    const monthlyFees = generateMonthlyFees(admissionDate);
    const hasUnpaidFees = monthlyFees.some(fee => fee.status === 'unpaid');
    
    students.push({
      id: i + 1,
      name: `Student ${i + 1}`,
      class: classes[Math.floor(Math.random() * classes.length)],
      phoneNumber: generatePhoneNumber(),
      admissionDate,
      feeStatus: hasUnpaidFees ? 'unpaid' : 'paid',
      monthlyFees
    });
  }
  
  return students;
}

export const dummyStudents = generateDummyData();