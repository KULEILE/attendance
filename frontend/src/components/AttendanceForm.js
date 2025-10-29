import React, { useState } from 'react';
import { attendanceAPI } from '../services/api';

const AttendanceForm = ({ onRecordAdded }) => {
  const [formData, setFormData] = useState({
    employeeName: '',
    employeeID: '',
    status: 'Present',
    date: new Date().toISOString().split('T')[0] // Default to today's date
  });
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.employeeName.trim() || !formData.employeeID.trim()) {
      setMessage('Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);
    setMessage('');

    try {
      await attendanceAPI.create(formData);
      setMessage('Attendance recorded successfully!');
      setFormData({
        employeeName: '',
        employeeID: '',
        status: 'Present',
        date: new Date().toISOString().split('T')[0]
      });
      if (onRecordAdded) {
        onRecordAdded();
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Error recording attendance. Please try again.';
      setMessage(errorMessage);
      console.error('Error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="form-container">
      <h2 style={{ marginBottom: '1.5rem', color: '#2c3e50' }}>Mark Attendance</h2>
      
      {message && (
        <div className={`message ${message.includes('Error') ? 'error' : 'success'}`}>
          {message}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="employeeName">Employee Name *</label>
          <input
            type="text"
            id="employeeName"
            name="employeeName"
            className="form-control"
            value={formData.employeeName}
            onChange={handleChange}
            required
            placeholder="Enter employee full name"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="employeeID">Employee ID *</label>
          <input
            type="text"
            id="employeeID"
            name="employeeID"
            className="form-control"
            value={formData.employeeID}
            onChange={handleChange}
            required
            placeholder="Enter employee ID"
          />
        </div>

        <div className="form-group">
          <label htmlFor="date">Attendance Date *</label>
          <input
            type="date"
            id="date"
            name="date"
            className="form-control"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="status">Attendance Status *</label>
          <select
            id="status"
            name="status"
            className="form-control"
            value={formData.status}
            onChange={handleChange}
            required
          >
            <option value="Present">Present</option>
            <option value="Absent">Absent</option>
          </select>
        </div>
        
        <button 
          type="submit" 
          className="btn btn-primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Recording...' : 'Record Attendance'}
        </button>
      </form>
    </div>
  );
};

export default AttendanceForm;