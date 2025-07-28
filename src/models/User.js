const { pool } = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
  constructor(userData) {
    this.id = userData.id;
    this.name = userData.name;
    this.email = userData.email;
    this.password = userData.password;
    this.image = userData.image || 'user.png';
    this.type_user = userData.type_user;
    this.created_at = userData.created_at;
    this.updated_at = userData.updated_at;
  }

  // Find user by email
  static async findByEmail(email) {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM users WHERE email = ?',
        [email]
      );
      return rows[0] ? new User(rows[0]) : null;
    } catch (error) {
      throw new Error(`Error finding user by email: ${error.message}`);
    }
  }

  // Find user by ID
  static async findById(id) {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM users WHERE id = ?',
        [id]
      );
      return rows[0] ? new User(rows[0]) : null;
    } catch (error) {
      throw new Error(`Error finding user by ID: ${error.message}`);
    }
  }

  // Create new user
  static async create(userData) {
    try {
      // Hash password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(userData.password, saltRounds);
      
      const [result] = await pool.execute(
        'INSERT INTO users (name, email, password, image, type_user, created_at, updated_at) VALUES (?, ?, ?, ?, ?, NOW(), NOW())',
        [
          userData.name,
          userData.email,
          hashedPassword,
          userData.image || 'user.png',
          userData.type_user || 'user'
        ]
      );
      
      return await User.findById(result.insertId);
    } catch (error) {
      throw new Error(`Error creating user: ${error.message}`);
    }
  }

  // Verify password
  async verifyPassword(password) {
    return await bcrypt.compare(password, this.password);
  }

  // Convert to JSON (excluding password)
  toJSON() {
    const userObject = { ...this };
    delete userObject.password;
    return userObject;
  }
}

module.exports = User;