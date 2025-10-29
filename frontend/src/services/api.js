import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL;


const api = axios.create({
  baseURL: API_BASE_URL,
});

export const attendanceAPI = {
  getAll: (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.date) params.append('date', filters.date);
    if (filters.search) params.append('search', filters.search);
    if (filters.year) params.append('year', filters.year);
    if (filters.month) params.append('month', filters.month);
    if (filters.week) params.append('week', filters.week);
    if (filters.status) params.append('status', filters.status);
    
    return api.get(`/attendance?${params.toString()}`);
  },
  
  create: (attendanceData) => {
    return api.post('/attendance', attendanceData);
  },
  
  delete: (id) => {
    return api.delete(`/attendance/${id}`);
  },

  // NEW: Employee history methods
  getEmployeeHistory: (employeeId, filters = {}) => {
    const params = new URLSearchParams();
    if (filters.year) params.append('year', filters.year);
    if (filters.month) params.append('month', filters.month);
    
    return api.get(`/attendance/employee-history/${employeeId}?${params.toString()}`);
  },
  
  getEmployeeDetails: (employeeId, filters = {}) => {
    const params = new URLSearchParams();
    if (filters.year) params.append('year', filters.year);
    if (filters.month) params.append('month', filters.month);
    if (filters.week) params.append('week', filters.week);
    
    return api.get(`/attendance/employee-details/${employeeId}?${params.toString()}`);
  }
};

export default api;