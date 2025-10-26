import React, { useState } from 'react';
import axios from 'axios';
import { Student } from '../types';

interface StudentFormProps {
  onSubmit: () => void;
  initialData?: Student;
}

const StudentForm: React.FC<StudentFormProps> = ({ onSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    class: initialData?.class || '',
    phoneNumber: initialData?.phoneNumber || ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (initialData) {
        await axios.put(`http://localhost:5000/api/students/${initialData.id}`, formData);
      } else {
        await axios.post('http://localhost:5000/api/students', formData);
      }
      onSubmit();
      setFormData({ name: '', class: '', phoneNumber: '' });
    } catch (error) {
      console.error('Error saving student:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="student-form">
      <div className="form-group">
        <label>Name:</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>
      <div className="form-group">
        <label>Class:</label>
        <input
          type="text"
          value={formData.class}
          onChange={(e) => setFormData({ ...formData, class: e.target.value })}
          required
        />
      </div>
      <div className="form-group">
        <label>Phone Number:</label>
        <input
          type="text"
          value={formData.phoneNumber}
          onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
          required
        />
      </div>
      <button type="submit">{initialData ? 'Update' : 'Add'} Student</button>
    </form>
  );
};

export default StudentForm;