export interface FeeRecord {
  month: string;
  year: number;
  status: 'paid' | 'unpaid';
  paidOn?: Date;
  amount: number;
}

export interface Student {
  id: number;
  name: string;
  class: string;
  phoneNumber: string;
  admissionDate: Date;
  feeStatus: 'paid' | 'unpaid';
  monthlyFees: FeeRecord[];
}

export const classes = [
  'Play Group',
  'Nursery',
  'Prep',
  'Class One',
  'Class Two',
  'Class Three',
  'Class Four',
  'Class Five',
  'Class Six',
  'Class Seven',
  'Class Eight',
  'Class Nine',
  'Class Ten'
];