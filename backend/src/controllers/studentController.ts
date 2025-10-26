import { Request, Response } from 'express';
import { Student } from '../models/Student';
import { FeeRecord } from '../models/FeeRecord';
import { isValidObjectId } from 'mongoose';
import { convertToCSV, downloadCSV } from '../utils/csvExport';

export const createStudent = async (req: Request, res: Response) => {
    try {
        const { name, class: studentClass, phoneNumber } = req.body;
        const student = new Student({
            name,
            class: studentClass,
            phoneNumber,
            feeStatus: 'unpaid',
            admissionDate: new Date()
        });
        await student.save();
        res.status(201).json(student);
    } catch (error) {
        console.error('Error creating student:', error);
        res.status(500).json({ message: 'Error creating student', error: error instanceof Error ? error.message : String(error) });
    }
};

export const getStudents = async (req: Request, res: Response) => {
    try {
        const { class: studentClass, feeStatus, month, year, sortBy, sortOrder } = req.query;
        
        const query: any = {};
        if (studentClass) query.class = studentClass;
        if (feeStatus) query.feeStatus = feeStatus;

        let students = Student.find(query);

        // Populate fee records with optional filtering
        if (month && year) {
            students = students.populate({
                path: 'feeRecords',
                match: {
                    month: month,
                    year: parseInt(year as string)
                }
            });
        } else {
            students = students.populate('feeRecords');
        }

        // Handle sorting
        if (sortBy && typeof sortBy === 'string') {
            const sortDirection = sortOrder === 'desc' ? -1 : 1;
            students = students.sort({ [sortBy]: sortDirection });
        }

        const result = await students.exec();
        res.json(result);
    } catch (error) {
        console.error('Error fetching students:', error);
        res.status(500).json({ message: 'Error fetching students', error: error instanceof Error ? error.message : String(error) });
    }
};

export const updateStudent = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        if (!isValidObjectId(id)) {
            return res.status(400).json({ message: 'Invalid student ID' });
        }

        const { name, class: studentClass, phoneNumber } = req.body;
        const updateData: { [key: string]: any } = {};
        
        if (name) updateData.name = name;
        if (studentClass) updateData.class = studentClass;
        if (phoneNumber) updateData.phoneNumber = phoneNumber;
        
        const student = await Student.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true, runValidators: true }
        );

        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        res.json(student);
    } catch (error) {
        console.error('Error updating student:', error);
        res.status(500).json({ message: 'Error updating student', error: error instanceof Error ? error.message : String(error) });
    }
};

export const deleteStudent = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        if (!isValidObjectId(id)) {
            return res.status(400).json({ message: 'Invalid student ID' });
        }

        const student = await Student.findById(id);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        // Delete the student and their fee records
        await Promise.all([
            Student.findByIdAndDelete(id),
            FeeRecord.deleteMany({ student: id })
        ]);

        res.json({ message: 'Student and associated records deleted successfully' });
    } catch (error) {
        console.error('Error deleting student:', error);
        res.status(500).json({ message: 'Error deleting student', error: error instanceof Error ? error.message : String(error) });
    }
};

export const getStudentById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        if (!isValidObjectId(id)) {
            return res.status(400).json({ message: 'Invalid student ID' });
        }

        const student = await Student.findById(id).populate('feeRecords');
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        res.json(student);
    } catch (error) {
        console.error('Error fetching student:', error);
        res.status(500).json({ message: 'Error fetching student', error: error instanceof Error ? error.message : String(error) });
    }
};

export const getStudentFeeHistory = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        if (!isValidObjectId(id)) {
            return res.status(400).json({ message: 'Invalid student ID' });
        }

        const student = await Student.findById(id);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        const feeRecords = await FeeRecord.find({ student: id })
            .sort({ year: -1, month: -1 })
            .exec();

        res.json({
            student: {
                id: student._id,
                name: student.name,
                class: student.class,
                feeStatus: student.feeStatus
            },
            feeRecords
        });
    } catch (error) {
        console.error('Error fetching fee history:', error);
        res.status(500).json({ message: 'Error fetching fee history', error: error instanceof Error ? error.message : String(error) });
    }
};

export const exportStudentsToCSV = async (req: Request, res: Response) => {
    try {
        const students = await Student.find().populate('feeRecords');
        
        const data = students.map(student => {
            const feeRecords = student.feeRecords || [];
            const totalFeesPaid = feeRecords.reduce((sum: number, record: any) => 
                record.status === 'paid' ? sum + record.amount : sum, 0);
            
            return {
                'Student ID': student._id,
                'Name': student.name,
                'Class': student.class,
                'Phone Number': student.phoneNumber,
                'Fee Status': student.feeStatus,
                'Total Fees Paid': totalFeesPaid,
                'Admission Date': student.admissionDate,
                'Last Updated': student.updatedAt
            };
        });

        const fields = [
            'Student ID',
            'Name',
            'Class',
            'Phone Number',
            'Fee Status',
            'Total Fees Paid',
            'Admission Date',
            'Last Updated'
        ];

        const csvString = convertToCSV(data, { fields });
        const buffer = downloadCSV(csvString, 'students.csv');

        res.setHeader('Content-Type', 'text/csv; charset=utf-8');
        res.setHeader('Content-Disposition', 'attachment; filename=students.csv');
        res.send(buffer);
    } catch (error) {
        console.error('Error exporting students to CSV:', error);
        res.status(500).json({ 
            message: 'Error exporting students to CSV', 
            error: error instanceof Error ? error.message : String(error) 
        });
    }
};

export const recordFeePayment = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        if (!isValidObjectId(id)) {
            return res.status(400).json({ message: 'Invalid student ID' });
        }

        const { month, year, amount } = req.body;
        if (!month || !year || !amount) {
            return res.status(400).json({ message: 'Month, year, and amount are required' });
        }

        const student = await Student.findById(id);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        // Create new fee record
        const feeRecord = new FeeRecord({
            student: id,
            month,
            year,
            amount,
            status: 'paid',
            paidAt: new Date()
        });

        // Save fee record and update student status atomically
        const [savedFeeRecord] = await Promise.all([
            feeRecord.save(),
            Student.findByIdAndUpdate(id, { feeStatus: 'paid' }, { new: true })
        ]);

        await savedFeeRecord.populate('student');
        res.json(savedFeeRecord);
    } catch (error) {
        console.error('Error recording fee payment:', error);
        res.status(500).json({ message: 'Error recording fee payment', error: error instanceof Error ? error.message : String(error) });
    }
};