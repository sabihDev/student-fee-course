import express from 'express';
import {
    createStudent,
    getStudents,
    getStudentById,
    updateStudent,
    deleteStudent,
    recordFeePayment,
    getStudentFeeHistory,
    exportStudentsToCSV
} from '../controllers/studentController';

const router = express.Router();

// Student CRUD routes
router.post('/students', createStudent);
router.get('/students', getStudents);
router.put('/students/:id', updateStudent);
router.delete('/students/:id', deleteStudent);

// Fee management routes
router.post('/students/:id/fee', recordFeePayment);
router.get('/students/export/csv', exportStudentsToCSV);
router.get('/students/:id', getStudentById);
router.get('/students/:id/fee-history', getStudentFeeHistory);

export default router;