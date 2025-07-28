const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to verify JWT token
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token de acceso requerido'
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user information
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Token inválido - usuario no encontrado'
      });
    }

    // Attach user to request object
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Token inválido'
      });
    } else if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expirado'
      });
    } else {
      return res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }
};

// Middleware to check if user is admin
const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Autenticación requerida'
    });
  }

  if (req.user.type_user !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Acceso denegado - se requieren permisos de administrador'
    });
  }

  next();
};

// Middleware to get propietario ID from user ID
const getPropietarioId = async (req, res, next) => {
  try {
    const { pool } = require('../config/database');
    const [rows] = await pool.execute(
      'SELECT id FROM propietario WHERE id = ?',
      [req.user.id]
    );

    if (rows.length === 0) {
      return res.status(403).json({
        success: false,
        message: 'Usuario no está registrado como propietario'
      });
    }

    req.propietarioId = rows[0].id;
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error verificando información de propietario'
    });
  }
};

module.exports = {
  authenticateToken,
  requireAdmin,
  getPropietarioId
};