const pool = require("../config/database");

class Review {
  // Obtener todas las reseñas de un negocio
  static async findByBusinessId(businessId) {
    const query = `
      SELECT 
        r.*,
        COALESCE(r.user_name, 'Usuario Anónimo') as user_name
      FROM reviews r
      WHERE r.business_id = $1
      ORDER BY r.created_at DESC
    `;
    const result = await pool.query(query, [businessId]);
    return result.rows;
  }

  // Obtener reseña por ID
  static async findById(id) {
    const query = `
      SELECT 
        r.*,
        COALESCE(r.user_name, 'Usuario Anónimo') as user_name
      FROM reviews r
      WHERE r.id = $1
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  }

  // Crear nueva reseña
  static async create(reviewData) {
    const { business_id, rating, comment, user_name, user_email } = reviewData;
    
    const query = `
      INSERT INTO reviews (business_id, rating, comment, user_name, user_email)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    
    const values = [business_id, rating, comment || null, user_name || null, user_email || null];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  // Calcular promedio de calificaciones de un negocio
  static async getAverageRating(businessId) {
    const query = `
      SELECT 
        COALESCE(AVG(rating), 0) as average_rating,
        COUNT(*) as total_reviews
      FROM reviews
      WHERE business_id = $1
    `;
    const result = await pool.query(query, [businessId]);
    return {
      averageRating: parseFloat(result.rows[0].average_rating) || 0,
      totalReviews: parseInt(result.rows[0].total_reviews) || 0
    };
  }

  // Eliminar reseña (opcional, para moderación)
  static async delete(id) {
    const query = `DELETE FROM reviews WHERE id = $1 RETURNING *`;
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  }
}

module.exports = Review;

