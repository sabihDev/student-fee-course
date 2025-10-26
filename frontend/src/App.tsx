import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
import { IStudent, Month, Class, months, classes } from './types';
import StudentForm from './components/StudentForm';
import FeeManagement from './components/FeeManagement';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5000/api';

type SortField = 'name' | 'class' | 'feeStatus';
type ViewMode = 'class' | 'month';
type FeeStatus = 'paid' | 'unpaid';

const App: React.FC = () => {
  const [students, setStudents] = useState<IStudent[]>([]);
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [selectedFeeStatus, setSelectedFeeStatus] = useState<FeeStatus | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<Month | null>(null);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [sortBy, setSortBy] = useState<SortField | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<IStudent | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('class');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStudents = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (selectedClass) params.append('class', selectedClass);
      if (selectedFeeStatus) params.append('feeStatus', selectedFeeStatus);
      if (selectedMonth) params.append('month', selectedMonth);
      if (selectedYear) params.append('year', selectedYear.toString());
      if (sortBy) {
        params.append('sortBy', sortBy);
        params.append('sortOrder', sortOrder);
      }

      const resp = await axios.get(`${API_URL}/students?${params.toString()}`);
      const respData = resp.data;
      // backend may return either an array of students or an ApiResponse wrapper
      if (Array.isArray(respData)) {
        setStudents(respData as IStudent[]);
      } else if (respData && respData.success === true) {
        setStudents(respData.data || []);
      } else {
        throw new Error((respData && respData.message) || 'Failed to fetch students');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred while fetching students';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [selectedClass, selectedFeeStatus, selectedMonth, selectedYear, sortBy, sortOrder]);

  const handleDownloadCSV = async (type: 'all' | 'paid' | 'unpaid') => {
    try {
      const params = new URLSearchParams();
      if (selectedMonth) params.append('month', selectedMonth);
      if (selectedYear) params.append('year', selectedYear.toString());
      if (type !== 'all') params.append('feeStatus', type);

      const response = await axios.get(
        `${API_URL}/students/export/csv?${params.toString()}`,
        { responseType: 'blob' }
      );
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `students-${type}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading CSV:', error);
    }
  };

  const handleDeleteStudent = async (id?: string) => {
    if (!id) return;
    
    try {
      const resp = await axios.delete(`${API_URL}/students/${id}`);
      // treat 2xx as success; backend may return a message or ApiResponse
      if (resp.status >= 200 && resp.status < 300) {
        toast.success('Student deleted successfully');
      } else {
        const respData = resp.data;
        throw new Error((respData && respData.message) || 'Failed to delete student');
      }
      fetchStudents();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error deleting student';
      toast.error(errorMessage);
    }
  };

  const classOptions = classes.map(c => ({ value: c, label: c }));
  const feeStatusOptions = [
    { value: 'paid' as FeeStatus, label: 'Paid' },
    { value: 'unpaid' as FeeStatus, label: 'Unpaid' }
  ];
  const sortOptions = [
    { value: 'name' as SortField, label: 'Name' },
    { value: 'class' as SortField, label: 'Class' },
    { value: 'feeStatus' as SortField, label: 'Fee Status' }
  ];
  const monthOptions = months.map(m => ({ value: m, label: m }));
  const yearOptions = Array.from(
    { length: 5 },
    (_, i) => ({ value: selectedYear - i, label: (selectedYear - i).toString() })
  );

  const renderStudentTable = (studentsToRender: IStudent[] | undefined) => {
    if (!Array.isArray(studentsToRender)) {
      return null;
    }
    
    return (
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Class</th>
            <th>Phone Number</th>
            <th>Fee Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {studentsToRender.map((student) => (
            <tr key={student._id || 'temp-key'}>
              <td>{student._id || 'N/A'}</td>
              <td>{student.name}</td>
              <td>{student.class}</td>
              <td>{student.phoneNumber}</td>
              <td className={student.feeStatus}>
                {student.feeStatus.charAt(0).toUpperCase() + student.feeStatus.slice(1)}
              </td>
              <td>
                <button onClick={() => setSelectedStudent(student)} className="btn-edit">
                  Manage Fees
                </button>
                {student._id && (
                  <button onClick={() => handleDeleteStudent(student._id)} className="btn-delete">
                    Delete
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div className="container">
      <ToastContainer position="top-right" autoClose={3000} />
      {error && <div className="error-message">{error}</div>}
      <h1>Student Fee Management System</h1>
      
      <div className="actions">
        <button onClick={() => setShowAddForm(!showAddForm)}>
          {showAddForm ? 'Cancel' : 'Add New Student'}
        </button>
        <div className="view-toggle">
          <button
            onClick={() => setViewMode('class')}
            className={viewMode === 'class' ? 'active' : ''}
          >
            View by Class
          </button>
          <button
            onClick={() => setViewMode('month')}
            className={viewMode === 'month' ? 'active' : ''}
          >
            View by Month
          </button>
        </div>
      </div>

      {showAddForm && (
        <StudentForm onSubmit={() => {
          setShowAddForm(false);
          fetchStudents();
        }} />
      )}

      <div className="filters">
        {viewMode === 'class' ? (
          <div className="filter-item">
            <label>Class:</label>
            <Select
              isClearable
              options={classOptions}
              onChange={(option) => setSelectedClass(option?.value ?? null)}
              value={selectedClass ? { value: selectedClass, label: selectedClass } : null}
            />
          </div>
        ) : (
          <>
            <div className="filter-item">
              <label>Month:</label>
              <Select
                isClearable
                options={monthOptions}
                onChange={(option) => setSelectedMonth(option?.value ?? null)}
                value={selectedMonth ? { value: selectedMonth, label: selectedMonth } : null}
              />
            </div>
            <div className="filter-item">
              <label>Year:</label>
              <Select
                options={yearOptions}
                onChange={(option) => option && setSelectedYear(option.value)}
                value={yearOptions.find(y => y.value === selectedYear)}
                className="form-select"
              />
            </div>
          </>
        )}
        
        <div className="filter-item">
          <label>Fee Status:</label>
          <Select
            isClearable
            options={feeStatusOptions}
            onChange={(option) => setSelectedFeeStatus(option?.value ?? null)}
            value={selectedFeeStatus ? {
              value: selectedFeeStatus,
              label: selectedFeeStatus.charAt(0).toUpperCase() + selectedFeeStatus.slice(1)
            } : null}
          />
        </div>
        
        <div className="filter-item">
          <label>Sort By:</label>
          <Select
            isClearable
            options={sortOptions}
            onChange={(option) => setSortBy(option?.value ?? null)}
            value={sortBy ? {
              value: sortBy,
              label: sortOptions.find(opt => opt.value === sortBy)?.label ?? sortBy
            } : null}
          />
        </div>
        
        <div className="filter-item">
          <label>Sort Order:</label>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
            className="form-select"
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
      </div>

      <div className="download-buttons">
        <button onClick={() => handleDownloadCSV('all')} className="download-btn">
          Download All
        </button>
        <button onClick={() => handleDownloadCSV('paid')} className="download-btn">
          Download Paid
        </button>
        <button onClick={() => handleDownloadCSV('unpaid')} className="download-btn">
          Download Unpaid
        </button>
      </div>

      <div className="students-container">
        {isLoading ? (
          <div className="loading-container">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          renderStudentTable(students)
        )}
      </div>

      {selectedStudent && (
        <div className="modal">
          <div className="modal-content">
            <button className="close-btn" onClick={() => setSelectedStudent(null)}>×</button>
            <FeeManagement
              student={selectedStudent}
              onUpdate={() => {
                fetchStudents();
                setSelectedStudent(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default App;