const { pool } = require('../config/database');

class Finca {
  constructor(fincaData) {
    this.id_Finca = fincaData.id_Finca;
    this.id_Propietario = fincaData.id_Propietario;
    this.Nombre = fincaData.Nombre;
    this.Explotacion_Tipo = fincaData.Explotacion_Tipo;
    this.archivado = fincaData.archivado || 0;
    this.created_at = fincaData.created_at;
    this.updated_at = fincaData.updated_at;
  }

  // Get all fincas for a propietario
  static async findByPropietario(id_Propietario) {
    try {
      const [rows] = await pool.execute(
        `SELECT f.*, p.Nombre as PropietarioNombre, p.Apellido as PropietarioApellido 
         FROM finca f 
         LEFT JOIN propietario p ON f.id_Propietario = p.id 
         WHERE f.id_Propietario = ? AND f.archivado = 0
         ORDER BY f.created_at DESC`,
        [id_Propietario]
      );
      return rows.map(row => new Finca(row));
    } catch (error) {
      throw new Error(`Error finding fincas by propietario: ${error.message}`);
    }
  }

  // Get all fincas (admin function)
  static async findAll(page = 1, limit = 10) {
    try {
      const offset = (page - 1) * limit;
      const [rows] = await pool.execute(
        `SELECT f.*, p.Nombre as PropietarioNombre, p.Apellido as PropietarioApellido,
                u.name as UsuarioNombre, u.email as UsuarioEmail
         FROM finca f 
         LEFT JOIN propietario p ON f.id_Propietario = p.id 
         LEFT JOIN users u ON p.id = u.id
         WHERE f.archivado = 0
         ORDER BY f.created_at DESC
         LIMIT ? OFFSET ?`,
        [limit, offset]
      );
      return rows.map(row => new Finca(row));
    } catch (error) {
      throw new Error(`Error finding all fincas: ${error.message}`);
    }
  }

  // Find finca by ID
  static async findById(id_Finca) {
    try {
      const [rows] = await pool.execute(
        `SELECT f.*, p.Nombre as PropietarioNombre, p.Apellido as PropietarioApellido 
         FROM finca f 
         LEFT JOIN propietario p ON f.id_Propietario = p.id 
         WHERE f.id_Finca = ? AND f.archivado = 0`,
        [id_Finca]
      );
      return rows[0] ? new Finca(rows[0]) : null;
    } catch (error) {
      throw new Error(`Error finding finca by ID: ${error.message}`);
    }
  }

  // Create new finca
  static async create(fincaData) {
    try {
      const [result] = await pool.execute(
        'INSERT INTO finca (id_Propietario, Nombre, Explotacion_Tipo, archivado, created_at, updated_at) VALUES (?, ?, ?, ?, NOW(), NOW())',
        [
          fincaData.id_Propietario,
          fincaData.Nombre,
          fincaData.Explotacion_Tipo,
          0
        ]
      );
      
      return await Finca.findById(result.insertId);
    } catch (error) {
      throw new Error(`Error creating finca: ${error.message}`);
    }
  }

  // Update finca
  async update(updateData) {
    try {
      const [result] = await pool.execute(
        'UPDATE finca SET Nombre = ?, Explotacion_Tipo = ?, updated_at = NOW() WHERE id_Finca = ? AND archivado = 0',
        [
          updateData.Nombre || this.Nombre,
          updateData.Explotacion_Tipo || this.Explotacion_Tipo,
          this.id_Finca
        ]
      );
      
      if (result.affectedRows === 0) {
        throw new Error('Finca not found or already deleted');
      }
      
      return await Finca.findById(this.id_Finca);
    } catch (error) {
      throw new Error(`Error updating finca: ${error.message}`);
    }
  }

  // Soft delete finca
  async delete() {
    try {
      const [result] = await pool.execute(
        'UPDATE finca SET archivado = 1, updated_at = NOW() WHERE id_Finca = ?',
        [this.id_Finca]
      );
      
      if (result.affectedRows === 0) {
        throw new Error('Finca not found');
      }
      
      return true;
    } catch (error) {
      throw new Error(`Error deleting finca: ${error.message}`);
    }
  }

  // Verify ownership
  static async verifyOwnership(id_Finca, id_Propietario) {
    try {
      const [rows] = await pool.execute(
        'SELECT id_Finca FROM finca WHERE id_Finca = ? AND id_Propietario = ? AND archivado = 0',
        [id_Finca, id_Propietario]
      );
      return rows.length > 0;
    } catch (error) {
      throw new Error(`Error verifying finca ownership: ${error.message}`);
    }
  }
}

module.exports = Finca;