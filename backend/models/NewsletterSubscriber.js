const pool = require("../config/database");

class NewsletterSubscriber {
  static async create(email) {
    const query = `
      INSERT INTO newsletter_subscribers (email)
      VALUES ($1)
      RETURNING *
    `;

    try {
      const result = await pool.query(query, [email]);
      return result.rows[0];
    } catch (error) {
      console.error("Error creating newsletter subscriber:", error);
      throw error;
    }
  }

  static async findAll(params = {}) {
    let query = "SELECT * FROM newsletter_subscribers WHERE 1=1";
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

    query += " ORDER BY subscribed_at DESC";

    try {
      const result = await pool.query(query, values);
      return result.rows;
    } catch (error) {
      console.error("Error finding newsletter subscribers:", error);
      throw error;
    }
  }

  static async findByEmail(email) {
    const query = "SELECT * FROM newsletter_subscribers WHERE email = $1";

    try {
      const result = await pool.query(query, [email]);
      return result.rows[0];
    } catch (error) {
      console.error("Error finding newsletter subscriber by email:", error);
      throw error;
    }
  }

  static async delete(id) {
    const query =
      "DELETE FROM newsletter_subscribers WHERE id = $1 RETURNING *";

    try {
      const result = await pool.query(query, [id]);
      return result.rows[0];
    } catch (error) {
      console.error("Error deleting newsletter subscriber:", error);
      throw error;
    }
  }
}

module.exports = NewsletterSubscriber;
