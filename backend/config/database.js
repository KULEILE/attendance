const { Pool } = require('pg');
require('dotenv').config();

// Create a new pool using environment variables
const pool = new Pool({
  user: process.env.DB_USER || 'luct_reporting_user',
  host: process.env.DB_HOST || 'dpg-d3fqslripnbc73b8saig-a.oregon-postgres.render.com',
  database: process.env.DB_NAME || 'attndance',
  password: process.env.DB_PASSWORD || 'qGfdST6IB7kmWEZtBjZ85iyVYct3lRfK',
  port: process.env.DB_PORT || 5432,
  ssl: {
    rejectUnauthorized: false // required for Render PostgreSQL
  }
});

// Optional: Test the connection immediately
pool.connect()
  .then(() => console.log('✅ Connected to PostgreSQL database'))
  .catch(err => console.error('❌ Database connection error:', err));

module.exports = pool;
