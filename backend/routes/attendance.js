const express = require('express');
const router = express.Router();
const pool = require('../config/database');

// GET all attendance records with advanced filtering
router.get('/', async (req, res, next) => {
  try {
    const { date, search, year, month, week, employeeId, status } = req.query;
    let query = `
      SELECT id, employee_name, employee_id, date, status, year, month, week, day, created_at 
      FROM attendance 
    `;
    let params = [];
    let conditions = [];

    if (date) {
      conditions.push(`date = $${conditions.length + 1}`);
      params.push(date);
    }

    if (search) {
      conditions.push(`(employee_name ILIKE $${conditions.length + 1} OR employee_id ILIKE $${conditions.length + 1})`);
      params.push(`%${search}%`);
    }

    if (year) {
      conditions.push(`year = $${conditions.length + 1}`);
      params.push(year);
    }

    if (month) {
      conditions.push(`month = $${conditions.length + 1}`);
      params.push(month);
    }

    if (week) {
      conditions.push(`week = $${conditions.length + 1}`);
      params.push(week);
    }

    if (employeeId) {
      conditions.push(`employee_id = $${conditions.length + 1}`);
      params.push(employeeId);
    }

    if (status) {
      conditions.push(`status = $${conditions.length + 1}`);
      params.push(status);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY date DESC, created_at DESC';

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

// POST new attendance record
router.post('/', async (req, res, next) => {
  try {
    const { employeeName, employeeID, status, date } = req.body;

    if (!employeeName || !employeeID || !status) {
      return res.status(400).json({ 
        error: 'Employee name, ID, and status are required.' 
      });
    }

    // Check if attendance already exists for this employee on this date
    const attendanceDate = date || new Date().toISOString().split('T')[0];
    const checkQuery = 'SELECT id FROM attendance WHERE employee_id = $1 AND date = $2';
    const checkResult = await pool.query(checkQuery, [employeeID, attendanceDate]);

    if (checkResult.rows.length > 0) {
      return res.status(400).json({ 
        error: 'Attendance already recorded for this employee on the selected date.' 
      });
    }

    const query = `
      INSERT INTO attendance (employee_name, employee_id, status, date) 
      VALUES ($1, $2, $3, $4) 
      RETURNING *
    `;
    const values = [employeeName, employeeID, status, attendanceDate];

    const result = await pool.query(query, values);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

// DELETE attendance record
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const query = 'DELETE FROM attendance WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Record not found.' });
    }

    res.json({ message: 'Record deleted successfully.', deletedRecord: result.rows[0] });
  } catch (error) {
    next(error);
  }
});

// NEW: Get employee attendance history with detailed breakdown
router.get('/employee-history/:employeeId', async (req, res, next) => {
  try {
    const { employeeId } = req.params;
    const { year, month } = req.query;

    let query = `
      SELECT 
        year,
        month,
        week,
        COUNT(*) as total_days,
        SUM(CASE WHEN status = 'Present' THEN 1 ELSE 0 END) as present_days,
        SUM(CASE WHEN status = 'Absent' THEN 1 ELSE 0 END) as absent_days,
        MIN(date) as period_start,
        MAX(date) as period_end
      FROM attendance 
      WHERE employee_id = $1
    `;

    const params = [employeeId];
    let paramCount = 1;

    if (year) {
      paramCount++;
      query += ` AND year = $${paramCount}`;
      params.push(year);
    }

    if (month) {
      paramCount++;
      query += ` AND month = $${paramCount}`;
      params.push(month);
    }

    query += `
      GROUP BY year, month, week
      ORDER BY year DESC, month DESC, week DESC
    `;

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

// NEW: Get employee daily details for a specific period
router.get('/employee-details/:employeeId', async (req, res, next) => {
  try {
    const { employeeId } = req.params;
    const { year, month, week } = req.query;

    let query = `
      SELECT date, status, created_at
      FROM attendance 
      WHERE employee_id = $1
    `;

    const params = [employeeId];
    let paramCount = 1;

    if (year) {
      paramCount++;
      query += ` AND year = $${paramCount}`;
      params.push(year);
    }

    if (month) {
      paramCount++;
      query += ` AND month = $${paramCount}`;
      params.push(month);
    }

    if (week) {
      paramCount++;
      query += ` AND week = $${paramCount}`;
      params.push(week);
    }

    query += ' ORDER BY date DESC';

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

module.exports = router;