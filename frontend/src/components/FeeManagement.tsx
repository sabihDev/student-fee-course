import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { IStudent, Month, months, ApiResponse, IFeeRecord } from '../types';
import './fee-management.css';

interface FeeManagementProps {
  student: IStudent | null;
  onUpdate: () => void;
}

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5000/api';

const FeeManagement: React.FC<FeeManagementProps> = ({ student, onUpdate }) => {
  if (!student) return null;

  const [selectedMonth, setSelectedMonth] = useState<Month | ''>('');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [amount, setAmount] = useState(5000);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentYear = new Date().getFullYear();
  const years = Array.from(
    new Set([
      ...Array.from({ length: 5 }, (_, i) => currentYear + i), // Next 5 years
      ...Array.from({ length: 2 }, (_, i) => currentYear - i - 1), // Previous 2 years
      ...(student.feeRecords?.map(fee => fee.year) || [])
    ])
  ).sort((a, b) => b - a);

  const handleFeeUpdate = async (status: 'paid' | 'unpaid', existingFeeId?: string) => {
    if (!student._id) return;
    
    if (existingFeeId && !window.confirm(`Are you sure you want to mark this fee as ${status}?`)) {
      return;
    }
    
    if (!existingFeeId && (!selectedMonth || !selectedYear)) {
      return;
    }
    
    setIsSubmitting(true);
    try {
      const { data } = await axios.post<ApiResponse<IFeeRecord>>(
        `${API_URL}/students/${student._id}/fee`,
        {
          month: existingFeeId ? undefined : selectedMonth,
          year: existingFeeId ? undefined : selectedYear,
          amount: existingFeeId ? undefined : amount,
          feeStatus: status,
          paidAt: status === 'paid' ? new Date().toISOString() : null,
          feeId: existingFeeId
        }
      );

      if (!data.success) {
        throw new Error(data.message || 'Failed to update fee status');
      }

      const message = existingFeeId 
        ? `Fee status updated to ${status}`
        : `New fee marked as ${status} for ${selectedMonth} ${selectedYear}`;
      
      toast.success(message);
      onUpdate();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error updating fee status';
      toast.error(message);
      console.error('Error updating fee status:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fee-management">
      <h3>Fee Management - {student.name}</h3>
      
      <div className="fee-controls">
        <select 
          value={selectedMonth} 
          onChange={(e) => setSelectedMonth(e.target.value as Month)}
          className="form-select"
        >
          <option value="">Select Month</option>
          {months.map(month => (
            <option key={month} value={month}>{month}</option>
          ))}
        </select>
        
        <select 
          value={selectedYear} 
          onChange={(e) => setSelectedYear(Number(e.target.value))}
          className="form-select"
        >
          {years.map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
        
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          min="0"
          className="form-control"
        />
        
        <button 
          onClick={() => handleFeeUpdate('paid')}
          disabled={!selectedMonth || isSubmitting}
          className="btn btn-success"
        >
          {isSubmitting ? 'Processing...' : 'Mark as Paid'}
        </button>
        
      </div>

      <div className="fee-history">
        <h4>Fee History</h4>
        <table className="table">
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
            {student.feeRecords?.map((fee) => (
              <tr key={fee._id ?? `${fee.month}-${fee.year}`}>
                <td>{fee.month}</td>
                <td>{fee.year}</td>
                <td className={fee.status}>
                  <button 
                    onClick={() => handleFeeUpdate(fee.status === 'paid' ? 'unpaid' : 'paid', fee._id)}
                    className={`btn btn-sm ${fee.status === 'paid' ? 'btn-warning' : 'btn-success'}`}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? '...' : fee.status}
                  </button>
                </td>
                <td>{fee.amount}</td>
                <td>{fee.paidAt ? new Date(fee.paidAt).toLocaleDateString() : 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FeeManagement;