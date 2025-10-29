import React, { useState, useEffect } from 'react';
import { attendanceAPI } from '../services/api';
import EmployeeHistory from './EmployeeHistory';

const Dashboard = () => {
  const [attendance, setAttendance] = useState([]);
  const [filters, setFilters] = useState({
    date: '',
    search: '',
    year: '',
    month: '',
    status: ''
  });
  const [loading, setLoading] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const fetchAttendance = async () => {
    setLoading(true);
    try {
      const response = await attendanceAPI.getAll(filters);
      setAttendance(response.data);
    } catch (error) {
      console.error('Error fetching attendance:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, [filters]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      try {
        await attendanceAPI.delete(id);
        fetchAttendance();
      } catch (error) {
        console.error('Error deleting record:', error);
        alert('Error deleting record. Please try again.');
      }
    }
  };

  const handleViewHistory = (employeeId, employeeName) => {
    setSelectedEmployee({ id: employeeId, name: employeeName });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const monthOptions = [
    { value: '', label: 'All Months' },
    { value: '1', label: 'January' }, { value: '2', label: 'February' },
    { value: '3', label: 'March' }, { value: '4', label: 'April' },
    { value: '5', label: 'May' }, { value: '6', label: 'June' },
    { value: '7', label: 'July' }, { value: '8', label: 'August' },
    { value: '9', label: 'September' }, { value: '10', label: 'October' },
    { value: '11', label: 'November' }, { value: '12', label: 'December' }
  ];

  return (
    <div>
      <div className="dashboard-header">
        <h2>Attendance Records</h2>
        <div className="filters">
          <input
            type="date"
            className="date-filter"
            value={filters.date}
            onChange={(e) => handleFilterChange('date', e.target.value)}
            placeholder="Filter by date"
          />
          <input
            type="text"
            className="search-box"
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            placeholder="Search by name or ID..."
          />
          <select
            value={filters.year}
            onChange={(e) => handleFilterChange('year', e.target.value)}
            className="form-control"
          >
            <option value="">All Years</option>
            <option value={new Date().getFullYear()}>{new Date().getFullYear()}</option>
            <option value={new Date().getFullYear() - 1}>{new Date().getFullYear() - 1}</option>
            <option value={new Date().getFullYear() - 2}>{new Date().getFullYear() - 2}</option>
          </select>
          <select
            value={filters.month}
            onChange={(e) => handleFilterChange('month', e.target.value)}
            className="form-control"
          >
            {monthOptions.map(month => (
              <option key={month.value} value={month.value}>{month.label}</option>
            ))}
          </select>
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="form-control"
          >
            <option value="">All Status</option>
            <option value="Present">Present</option>
            <option value="Absent">Absent</option>
          </select>
        </div>
      </div>

      <div className="table-container">
        {loading ? (
          <div className="loading-message">Loading attendance records...</div>
        ) : attendance.length === 0 ? (
          <div className="no-data-message">No attendance records found.</div>
        ) : (
          <table className="attendance-table">
            <thead>
              <tr>
                <th>Employee Name</th>
                <th>Employee ID</th>
                <th>Date</th>
                <th>Day</th>
                <th>Status</th>
                <th>Recorded At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {attendance.map((record) => (
                <tr key={record.id}>
                  <td>{record.employee_name}</td>
                  <td>{record.employee_id}</td>
                  <td>{formatDate(record.date)}</td>
                  <td>{new Date(record.date).toLocaleDateString('en-US', { weekday: 'long' })}</td>
                  <td>
                    <span className={`status-${record.status.toLowerCase()}`}>
                      {record.status}
                    </span>
                  </td>
                  <td>{new Date(record.created_at).toLocaleString()}</td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="btn view-history-btn"
                        onClick={() => handleViewHistory(record.employee_id, record.employee_name)}
                      >
                        View History
                      </button>
                      <button
                        className="btn btn-danger"
                        onClick={() => handleDelete(record.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {selectedEmployee && (
        <div className="employee-history-modal">
          <div className="modal-header">
            <h3>Employee Attendance History</h3>
            <button 
              className="btn btn-secondary"
              onClick={() => setSelectedEmployee(null)}
            >
              Close
            </button>
          </div>
          <EmployeeHistory 
            employeeId={selectedEmployee.id}
            employeeName={selectedEmployee.name}
          />
        </div>
      )}
    </div>
  );
};

export default Dashboard;