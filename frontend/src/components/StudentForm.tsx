import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { IStudent, classes } from '../types';
import './StudentForm.css';

type FormErrors = {
  name?: string;
  class?: string;
  phoneNumber?: string;
};

interface StudentFormProps {
  onSubmit: () => void;
  initialData?: IStudent;
}

const StudentForm: React.FC<StudentFormProps> = ({ onSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    class: initialData?.class || '',
    phoneNumber: initialData?.phoneNumber || ''
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors: FormErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.length < 3) {
      newErrors.name = 'Name must be at least 3 characters';
    }

    if (!formData.class) {
      newErrors.class = 'Class selection is required';
    }

    if (!formData.phoneNumber) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!/^[0-9]{11}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Phone number must be 11 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    try {
      if (initialData?._id) {
        // Backend returns the updated student object (not wrapped in { success }).
        const resp = await axios.put(`/api/students/${initialData._id}`, formData);
        const data = resp.data;
        // accept either ApiResponse or plain student object
        if ((data && (data.success === true)) || (data && data._id)) {
          toast.success('Student updated successfully');
        } else {
          throw new Error((data && data.message) || 'Failed to update student');
        }
      } else {
        // Create student: backend returns 201 with created student object
        const resp = await axios.post('/api/students', formData);
        const data = resp.data;
        if (resp.status === 201 || (data && (data.success === true)) || (data && data._id)) {
          toast.success('Student added successfully');
        } else {
          throw new Error((data && data.message) || 'Failed to add student');
        }
      }
      onSubmit();
      setFormData({ name: '', class: '', phoneNumber: '' });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An error occurred';
      toast.error(message);
      console.error('Error saving student:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="student-form">
      <div className="form-group">
        <label>Name:</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          className={`form-control ${errors.name ? 'is-invalid' : ''}`}
        />
        {errors.name && <div className="invalid-feedback">{errors.name}</div>}
      </div>
      <div className="form-group">
        <label>Class:</label>
        <select
          name="class"
          value={formData.class}
          onChange={handleInputChange}
          className={`form-select ${errors.class ? 'is-invalid' : ''}`}
        >
          <option value="">Select Class</option>
          {classes.map((cls) => (
            <option key={cls} value={cls}>
              {cls}
            </option>
          ))}
        </select>
        {errors.class && <div className="invalid-feedback">{errors.class}</div>}
      </div>
      <div className="form-group">
        <label>Phone Number:</label>
        <input
          type="tel"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleInputChange}
          className={`form-control ${errors.phoneNumber ? 'is-invalid' : ''}`}
          pattern="[0-9]{11}"
          title="Phone number should be 11 digits"
        />
        {errors.phoneNumber && <div className="invalid-feedback">{errors.phoneNumber}</div>}
      </div>
      <button 
        type="submit" 
        className="btn btn-primary"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
            {initialData ? 'Updating...' : 'Adding...'}
          </>
        ) : (
          initialData ? 'Update Student' : 'Add Student'
        )}
      </button>
    </form>
  );
};

export default StudentForm;