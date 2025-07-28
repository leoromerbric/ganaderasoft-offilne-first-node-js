const Finca = require('../models/Finca');

// Get all fincas for current propietario
const getFincas = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    let fincas;
    
    // If user is admin, get all fincas, otherwise get only user's fincas
    if (req.user.type_user === 'admin') {
      fincas = await Finca.findAll(page, limit);
    } else {
      fincas = await Finca.findByPropietario(req.propietarioId);
    }

    res.json({
      success: true,
      message: 'Fincas obtenidas exitosamente',
      data: {
        fincas,
        pagination: {
          page,
          limit,
          total: fincas.length
        }
      }
    });
  } catch (error) {
    console.error('Get fincas error:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get single finca by ID
const getFinca = async (req, res) => {
  try {
    const { id } = req.params;
    
    const finca = await Finca.findById(id);
    if (!finca) {
      return res.status(404).json({
        success: false,
        message: 'Finca no encontrada'
      });
    }

    // Check ownership (unless admin)
    if (req.user.type_user !== 'admin' && finca.id_Propietario !== req.propietarioId) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para acceder a esta finca'
      });
    }

    res.json({
      success: true,
      message: 'Finca obtenida exitosamente',
      data: {
        finca
      }
    });
  } catch (error) {
    console.error('Get finca error:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Create new finca
const createFinca = async (req, res) => {
  try {
    const { Nombre, Explotacion_Tipo } = req.body;

    // Validation
    if (!Nombre || !Explotacion_Tipo) {
      return res.status(400).json({
        success: false,
        message: 'Nombre y Tipo de Explotación son requeridos'
      });
    }

    // Create finca data
    const fincaData = {
      id_Propietario: req.propietarioId,
      Nombre,
      Explotacion_Tipo
    };

    const newFinca = await Finca.create(fincaData);

    res.status(201).json({
      success: true,
      message: 'Finca creada exitosamente',
      data: {
        finca: newFinca
      }
    });
  } catch (error) {
    console.error('Create finca error:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Update finca
const updateFinca = async (req, res) => {
  try {
    const { id } = req.params;
    const { Nombre, Explotacion_Tipo } = req.body;

    // Find finca
    const finca = await Finca.findById(id);
    if (!finca) {
      return res.status(404).json({
        success: false,
        message: 'Finca no encontrada'
      });
    }

    // Check ownership (unless admin)
    if (req.user.type_user !== 'admin' && finca.id_Propietario !== req.propietarioId) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para modificar esta finca'
      });
    }

    // Update data
    const updateData = {};
    if (Nombre) updateData.Nombre = Nombre;
    if (Explotacion_Tipo) updateData.Explotacion_Tipo = Explotacion_Tipo;

    const updatedFinca = await finca.update(updateData);

    res.json({
      success: true,
      message: 'Finca actualizada exitosamente',
      data: {
        finca: updatedFinca
      }
    });
  } catch (error) {
    console.error('Update finca error:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Delete finca (soft delete)
const deleteFinca = async (req, res) => {
  try {
    const { id } = req.params;

    // Find finca
    const finca = await Finca.findById(id);
    if (!finca) {
      return res.status(404).json({
        success: false,
        message: 'Finca no encontrada'
      });
    }

    // Check ownership (unless admin)
    if (req.user.type_user !== 'admin' && finca.id_Propietario !== req.propietarioId) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para eliminar esta finca'
      });
    }

    await finca.delete();

    res.json({
      success: true,
      message: 'Finca eliminada exitosamente'
    });
  } catch (error) {
    console.error('Delete finca error:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  getFincas,
  getFinca,
  createFinca,
  updateFinca,
  deleteFinca
};