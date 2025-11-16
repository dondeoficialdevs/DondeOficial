const pool = require("../config/database");
const bcrypt = require("bcrypt");

class User {
  // Buscar usuario por email
  static async findByEmail(email) {
    const query = "SELECT * FROM users WHERE email = $1";

    try {
      const result = await pool.query(query, [email]);
      return result.rows[0];
    } catch (error) {
      console.error("Error finding user by email:", error);
      throw error;
    }
  }

  // Buscar usuario por ID
  static async findById(id) {
    const query =
      "SELECT id, email, full_name, created_at FROM users WHERE id = $1";

    try {
      const result = await pool.query(query, [id]);
      return result.rows[0];
    } catch (error) {
      console.error("Error finding user by ID:", error);
      throw error;
    }
  }

  // Crear nuevo usuario
  static async create(userData) {
    const { email, password, full_name } = userData;

    // Hash del password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const query = `
      INSERT INTO users (email, password, full_name)
      VALUES ($1, $2, $3)
      RETURNING id, email, full_name, created_at
    `;

    try {
      const result = await pool.query(query, [
        email,
        hashedPassword,
        full_name,
      ]);
      return result.rows[0];
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  }

  // Verificar password
  static async verifyPassword(plainPassword, hashedPassword) {
    try {
      return await bcrypt.compare(plainPassword, hashedPassword);
    } catch (error) {
      console.error("Error verifying password:", error);
      throw error;
    }
  }

  // Cambiar contraseña
  static async changePassword(userId, newPassword) {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    const query = `
      UPDATE users 
      SET password = $1 
      WHERE id = $2
      RETURNING id, email, full_name
    `;

    try {
      const result = await pool.query(query, [hashedPassword, userId]);
      return result.rows[0];
    } catch (error) {
      console.error("Error changing password:", error);
      throw error;
    }
  }

  // Guardar refresh token
  static async saveRefreshToken(userId, token, expiresAt) {
    const query = `
      INSERT INTO refresh_tokens (user_id, token, expires_at)
      VALUES ($1, $2, $3)
      RETURNING *
    `;

    try {
      const result = await pool.query(query, [userId, token, expiresAt]);
      return result.rows[0];
    } catch (error) {
      console.error("Error saving refresh token:", error);
      throw error;
    }
  }

  // Buscar refresh token
  static async findRefreshToken(token) {
    const query = `
      SELECT rt.*, u.email, u.full_name 
      FROM refresh_tokens rt
      JOIN users u ON rt.user_id = u.id
      WHERE rt.token = $1 AND rt.expires_at > NOW()
    `;

    try {
      const result = await pool.query(query, [token]);
      return result.rows[0];
    } catch (error) {
      console.error("Error finding refresh token:", error);
      throw error;
    }
  }

  // Eliminar refresh token (logout)
  static async deleteRefreshToken(token) {
    const query = "DELETE FROM refresh_tokens WHERE token = $1";

    try {
      await pool.query(query, [token]);
      return true;
    } catch (error) {
      console.error("Error deleting refresh token:", error);
      throw error;
    }
  }

  // Eliminar todos los refresh tokens de un usuario
  static async deleteAllRefreshTokens(userId) {
    const query = "DELETE FROM refresh_tokens WHERE user_id = $1";

    try {
      await pool.query(query, [userId]);
      return true;
    } catch (error) {
      console.error("Error deleting all refresh tokens:", error);
      throw error;
    }
  }
}
//
module.exports = User;
