import React, { useState } from 'react';
import axios from 'axios';
import { Student, months } from '../types';

interface FeeManagementProps {
  student: Student | null;
  onUpdate: () => void;
}

const FeeManagement: React.FC<FeeManagementProps> = ({ student, onUpdate }) => {
  if (!student) return null;
  
  const [currentStudent, setCurrentStudent] = useState<Student>(student);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [amount, setAmount] = useState(5000);

  const years = Array.from(
    new Set(currentStudent.monthlyFees.map(fee => fee.year))
  ).sort((a, b) => b - a);

  const handleFeeUpdate = async (status: 'paid' | 'unpaid') => {
    try {
      await axios.put(`http://localhost:5000/api/students/${currentStudent.id}/fees`, {
        month: selectedMonth,
        year: selectedYear,
        status,
        amount
      });
      onUpdate();
    } catch (error) {
      console.error('Error updating fee status:', error);
    }
  };

  const getFeeStatus = (month: string, year: number) => {
    const feeRecord = student.monthlyFees.find(
      fee => fee.month === month && fee.year === year
    );
    return feeRecord?.status || 'N/A';
  };

  const getFeeAmount = (month: string, year: number) => {
    const feeRecord = student.monthlyFees.find(
      fee => fee.month === month && fee.year === year
    );
    return feeRecord?.amount || 'N/A';
  };

  return (
    <div className="fee-management">
      <h3>Fee Management - {currentStudent.name}</h3>
      
      <div className="fee-controls">
        <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
          <option value="">Select Month</option>
          {months.map(month => (
            <option key={month} value={month}>{month}</option>
          ))}
        </select>
        
        <select value={selectedYear} onChange={(e) => setSelectedYear(Number(e.target.value))}>
          {years.map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
        
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          min="0"
        />
        
        <button 
          onClick={() => handleFeeUpdate('paid')}
          disabled={!selectedMonth}
          className="btn-paid"
        >
          Mark as Paid
        </button>
        
        <button
          onClick={() => handleFeeUpdate('unpaid')}
          disabled={!selectedMonth}
          className="btn-unpaid"
        >
          Mark as Unpaid
        </button>
      </div>

      <div className="fee-history">
        <h4>Fee History</h4>
        <table>
          <thead>
            <tr>
              <th>Month</th>
              <th>Year</th>
              <th>Status</th>
              <th>Amount</th>
              <th>Paid On</th>
            </tr>
          </thead>
          <tbody>
            {currentStudent.monthlyFees.map((fee) => (
              <tr key={`${fee.month}-${fee.year}`}>
                <td>{fee.month}</td>
                <td>{fee.year}</td>
                <td className={fee.status}>{fee.status}</td>
                <td>{fee.amount}</td>
                <td>{fee.paidOn ? new Date(fee.paidOn).toLocaleDateString() : 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FeeManagement;