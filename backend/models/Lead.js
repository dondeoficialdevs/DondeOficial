const pool = require("../config/database");

class Lead {
  static async create(leadData) {
    const { full_name, email, subject, message } = leadData;

    const query = `
      INSERT INTO leads (full_name, email, subject, message)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;

    const values = [full_name, email, subject, message];

    try {
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error("Error creating lead:", error);
      throw error;
    }
  }

  static async findAll(params = {}) {
    let query = "SELECT * FROM leads WHERE 1=1";
    const values = [];
    let paramIndex = 1;

    // Agregar paginación
    if (params.limit) {
      query += ` LIMIT $${paramIndex}`;
      values.push(params.limit);
      paramIndex++;
    }

    if (params.offset) {
      query += ` OFFSET $${paramIndex}`;
      values.push(params.offset);
    }

    query += " ORDER BY created_at DESC";

    try {
      const result = await pool.query(query, values);
      return result.rows;
    } catch (error) {
      console.error("Error finding leads:", error);
      throw error;
    }
  }

  static async findById(id) {
    const query = "SELECT * FROM leads WHERE id = $1";

    try {
      const result = await pool.query(query, [id]);
      return result.rows[0];
    } catch (error) {
      console.error("Error finding lead by ID:", error);
      throw error;
    }
  }

  static async checkDuplicate(email, full_name) {
    const query = "SELECT * FROM leads WHERE email = $1 AND full_name = $2";

    try {
      const result = await pool.query(query, [email, full_name]);
      return result.rows[0];
    } catch (error) {
      console.error("Error checking duplicate lead:", error);
      throw error;
    }
  }
}

module.exports = Lead;
