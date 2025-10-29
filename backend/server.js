const express = require('express');
const cors = require('cors');
const attendanceRoutes = require('./routes/attendance');
const errorHandler = require('./middleware/errorHandler');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/attendance', attendanceRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ message: 'Server is running successfully!' });
});

// Error handling middleware
app.use(errorHandler);

// Handle 404
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found.' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});