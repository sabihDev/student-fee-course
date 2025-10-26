import { Request, Response } from 'express';
import { Student } from '../models/Student';
import { FeeRecord } from '../models/FeeRecord';

export const createStudent = async (req: Request, res: Response) => {
    try {
        const { name, class: studentClass, phoneNumber } = req.body;
        const student = new Student({
            name,
            class: studentClass,
            phoneNumber,
            feeStatus: 'unpaid'
        });
        await student.save();
        res.status(201).json(student);
    } catch (error) {
        console.error('Error creating student:', error);
        res.status(500).json({ message: 'Error creating student' });
    }
};

export const getStudents = async (req: Request, res: Response) => {
    try {
        const { class: studentClass, feeStatus, month, year } = req.query;
        const query: any = {};

        if (studentClass) {
            query.class = studentClass;
        }

        if (feeStatus) {
            query.feeStatus = feeStatus;
        }

        let students = await Student.find(query).populate({
            path: 'feeRecords',
            match: month && year ? { month, year: parseInt(year as string) } : {}
        });

        if (req.query.sortBy) {
            const sortField = req.query.sortBy as string;
            const sortOrder = req.query.sortOrder === 'desc' ? -1 : 1;
            students = students.sort((a: any, b: any) => {
                if (a[sortField] < b[sortField]) return -1 * sortOrder;
                if (a[sortField] > b[sortField]) return 1 * sortOrder;
                return 0;
            });
        }

        res.json(students);
    } catch (error) {
        console.error('Error fetching students:', error);
        res.status(500).json({ message: 'Error fetching students' });
    }
};

export const updateStudent = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { name, class: studentClass, phoneNumber } = req.body;
        
        const student = await Student.findById(id);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        if (name) student.name = name;
        if (studentClass) student.class = studentClass;
        if (phoneNumber) student.phoneNumber = phoneNumber;

        await student.save();
        res.json(student);
    } catch (error) {
        console.error('Error updating student:', error);
        res.status(500).json({ message: 'Error updating student' });
    }
};

export const deleteStudent = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const student = await Student.findById(id);
        
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        await Promise.all([
            Student.findByIdAndDelete(id),
            FeeRecord.deleteMany({ student: id })
        ]);

        res.json({ message: 'Student deleted successfully' });
    } catch (error) {
        console.error('Error deleting student:', error);
        res.status(500).json({ message: 'Error deleting student' });
    }
};

export const recordFeePayment = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { month, year, amount } = req.body;

        const student = await Student.findById(id);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        const feeRecord = new FeeRecord({
            student: id,
            month,
            year,
            amount,
            status: 'paid',
            paidAt: new Date()
        });

        await Promise.all([
            feeRecord.save(),
            Student.findByIdAndUpdate(id, { feeStatus: 'paid' })
        ]);

        res.json(feeRecord);
    } catch (error) {
        console.error('Error recording fee payment:', error);
        res.status(500).json({ message: 'Error recording fee payment' });
    }
};

export const exportStudentData = async (req: Request, res: Response) => {
    try {
        const students = await Student.find().populate('feeRecords');
        
        const data = students.map(student => {
            const feesPaid = (student.feeRecords as any[])?.reduce((sum, record) => 
                record.status === 'paid' ? sum + record.amount : sum, 0) || 0;
            
            return {
                Name: student.name,
                Class: student.class,
                'Phone Number': student.phoneNumber,
                'Fee Status': student.feeStatus,
                'Total Fees Paid': feesPaid,
                'Admission Date': student.admissionDate
            };
        });

        // Send JSON response for now
        // TODO: Implement CSV export if needed
        res.json(data);
    } catch (error) {
        console.error('Error exporting student data:', error);
        res.status(500).json({ message: 'Error exporting student data' });
    }
};