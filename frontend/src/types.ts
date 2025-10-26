export interface IFeeRecord {
    _id?: string;
    student: string;
    month: string;
    year: number;
    amount: number;
    status: 'paid' | 'unpaid';
    paidAt?: Date;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface IStudent {
    _id?: string;
    name: string;
    class: string;
    phoneNumber: string;
    feeStatus: 'paid' | 'unpaid';
    admissionDate: Date;
    createdAt?: Date;
    updatedAt?: Date;
    feeRecords?: IFeeRecord[];
}

export const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
] as const;

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
] as const;

export type Month = typeof months[number];
export type Class = typeof classes[number];

// API response types
export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}

// For CSV Export
export interface StudentExport {
    'Student ID': string;
    'Name': string;
    'Class': string;
    'Phone Number': string;
    'Fee Status': string;
    'Total Fees Paid': number;
    'Admission Date': string;
    'Last Updated': string;
}