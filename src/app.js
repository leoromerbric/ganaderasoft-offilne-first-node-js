const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/auth');
const fincaRoutes = require('./routes/finca');

// Create Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet());

// CORS configuration
const corsOptions = {
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};
app.use(cors(corsOptions));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Ganaderasoft API Gateway is running',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'API is healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/fincas', fincaRoutes);

// 404 handler - handle unmatched routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint no encontrado',
    path: req.originalUrl
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('Global error handler:', error);
  
  res.status(error.status || 500).json({
    success: false,
    message: error.message || 'Error interno del servidor',
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
});

// Database connection test
const testDatabase = async () => {
  try {
    const { pool } = require('./config/database');
    const connection = await pool.getConnection();
    console.log('✅ Database connection successful');
    connection.release();
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.log('⚠️  API will continue to run but database operations will fail');
  }
};

// Start server
app.listen(PORT, async () => {
  console.log('🚀 Ganaderasoft API Gateway Started');
  console.log(`📍 Server running on port ${PORT}`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📝 API Base URL: http://localhost:${PORT}/api`);
  console.log('🔍 Testing database connection...');
  
  await testDatabase();
  
  console.log('\n📚 Available endpoints:');
  console.log('  GET  /              - API status');
  console.log('  GET  /health        - Health check');
  console.log('  POST /api/auth/register - Register user');
  console.log('  POST /api/auth/login    - Login user');
  console.log('  GET  /api/auth/profile  - Get user profile');
  console.log('  GET  /api/fincas        - List fincas');
  console.log('  POST /api/fincas        - Create finca');
  console.log('  GET  /api/fincas/:id    - Get finca by ID');
  console.log('  PUT  /api/fincas/:id    - Update finca');
  console.log('  DELETE /api/fincas/:id  - Delete finca');
});

module.exports = app;