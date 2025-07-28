const express = require('express');
const router = express.Router();
const { authenticateToken, getPropietarioId } = require('../middleware/auth');
const {
  getFincas,
  getFinca,
  createFinca,
  updateFinca,
  deleteFinca
} = require('../controllers/fincaController');

// Helper middleware to check propietario for non-admin users
const checkPropietario = (req, res, next) => {
  if (req.user.type_user === 'admin') {
    return next();
  }
  return getPropietarioId(req, res, next);
};

// CRUD routes for fincas
router.get('/', authenticateToken, checkPropietario, getFincas);                    // GET /api/fincas - List all fincas
router.get('/:id', authenticateToken, checkPropietario, getFinca);                  // GET /api/fincas/:id - Get single finca
router.post('/', authenticateToken, checkPropietario, createFinca);                 // POST /api/fincas - Create new finca
router.put('/:id', authenticateToken, checkPropietario, updateFinca);               // PUT /api/fincas/:id - Update finca
router.delete('/:id', authenticateToken, checkPropietario, deleteFinca);            // DELETE /api/fincas/:id - Delete finca

module.exports = router;