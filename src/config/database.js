const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'ganaderasoft',
  charset: 'utf8mb4',
  timezone: 'Z'
};

// Create connection pool
const pool = mysql.createPool(dbConfig);

module.exports = {
  pool,
  dbConfig
};