import React, { useState, useEffect } from 'react';
import { attendanceAPI } from '../services/api';

const EmployeeHistory = ({ employeeId, employeeName }) => {
  const [history, setHistory] = useState([]);
  const [dailyDetails, setDailyDetails] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState({});
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    year: new Date().getFullYear(),
    month: ''
  });

  const fetchEmployeeHistory = async () => {
    if (!employeeId) return;
    
    setLoading(true);
    try {
      const response = await attendanceAPI.getEmployeeHistory(employeeId, filters);
      setHistory(response.data);
    } catch (error) {
      console.error('Error fetching employee history:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDailyDetails = async (year, month, week) => {
    try {
      const response = await attendanceAPI.getEmployeeDetails(employeeId, { year, month, week });
      setDailyDetails(response.data);
      setSelectedPeriod({ year, month, week });
    } catch (error) {
      console.error('Error fetching daily details:', error);
    }
  };

  useEffect(() => {
    fetchEmployeeHistory();
  }, [employeeId, filters]);

  const monthOptions = [
    { value: '', label: 'All Months' },
    { value: '1', label: 'January' }, { value: '2', label: 'February' },
    { value: '3', label: 'March' }, { value: '4', label: 'April' },
    { value: '5', label: 'May' }, { value: '6', label: 'June' },
    { value: '7', label: 'July' }, { value: '8', label: 'August' },
    { value: '9', label: 'September' }, { value: '10', label: 'October' },
    { value: '11', label: 'November' }, { value: '12', label: 'December' }
  ];

  const getAttendancePercentage = (present, total) => {
    return total > 0 ? Math.round((present / total) * 100) : 0;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getMonthName = (monthNumber) => {
    return monthOptions.find(m => m.value === monthNumber.toString())?.label || monthNumber;
  };

  return (
    <div className="employee-history">
      <div className="history-header">
        <h3>Attendance History: {employeeName} ({employeeId})</h3>
        <div className="history-filters">
          <select 
            value={filters.year} 
            onChange={(e) => setFilters({...filters, year: e.target.value})}
            className="form-control"
          >
            {[new Date().getFullYear(), new Date().getFullYear() - 1, new Date().getFullYear() - 2].map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
          <select 
            value={filters.month} 
            onChange={(e) => setFilters({...filters, month: e.target.value})}
            className="form-control"
          >
            {monthOptions.map(month => (
              <option key={month.value} value={month.value}>{month.label}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="loading-message">Loading history...</div>
      ) : history.length === 0 ? (
        <div className="no-data-message">No attendance records found for this period.</div>
      ) : (
        <div className="history-content">
          <div className="summary-cards">
            {history.map((period, index) => (
              <div 
                key={index} 
                className="summary-card"
                onClick={() => fetchDailyDetails(period.year, period.month, period.week)}
              >
                <div className="period-info">
                  <strong>
                    {period.year} - {getMonthName(period.month)}, Week {period.week}
                  </strong>
                  <div className="period-dates">
                    {formatDate(period.period_start)} to {formatDate(period.period_end)}
                  </div>
                </div>
                <div className="attendance-stats">
                  <div className="stat present">
                    <span className="stat-label">Present:</span>
                    <span className="stat-value">{period.present_days}</span>
                  </div>
                  <div className="stat absent">
                    <span className="stat-label">Absent:</span>
                    <span className="stat-value">{period.absent_days}</span>
                  </div>
                  <div className="stat total">
                    <span className="stat-label">Total:</span>
                    <span className="stat-value">{period.total_days}</span>
                  </div>
                  <div className="stat percentage">
                    <span className="stat-label">Rate:</span>
                    <span className="stat-value">
                      {getAttendancePercentage(period.present_days, period.total_days)}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {dailyDetails.length > 0 && (
            <div className="daily-details">
              <h4>
                Daily Details for {selectedPeriod.year} - {getMonthName(selectedPeriod.month)} Week {selectedPeriod.week}
              </h4>
              <table className="details-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Day</th>
                    <th>Status</th>
                    <th>Recorded At</th>
                  </tr>
                </thead>
                <tbody>
                  {dailyDetails.map((record, index) => (
                    <tr key={index}>
                      <td>{formatDate(record.date)}</td>
                      <td>{new Date(record.date).toLocaleDateString('en-US', { weekday: 'long' })}</td>
                      <td>
                        <span className={`status-${record.status.toLowerCase()}`}>
                          {record.status}
                        </span>
                      </td>
                      <td>{new Date(record.created_at).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EmployeeHistory;