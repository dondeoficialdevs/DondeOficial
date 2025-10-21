const pool = require('../config/database');

class Business {
  static async findAll(params = {}) {
    let query = `
      SELECT b.*, c.name as category_name 
      FROM businesses b 
      LEFT JOIN categories c ON b.category_id = c.id
      WHERE 1=1
    `;
    const values = [];
    let paramIndex = 1;

    // Filtrar por categoría
    if (params.category) {
      query += ` AND c.name ILIKE $${paramIndex}`;
      values.push(`%${params.category}%`);
      paramIndex++;
    }

    // Filtrar por término de búsqueda
    if (params.search) {
      query += ` AND (b.name ILIKE $${paramIndex} OR b.description ILIKE $${paramIndex})`;
      values.push(`%${params.search}%`);
      paramIndex++;
    }

    // Filtrar por ubicación
    if (params.location) {
      query += ` AND b.address ILIKE $${paramIndex}`;
      values.push(`%${params.location}%`);
      paramIndex++;
    }

    query += ` ORDER BY b.name ASC`;

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

    try {
      const result = await pool.query(query, values);
      return result.rows;
    } catch (error) {
      console.error('Error finding businesses:', error);
      throw error;
    }
  }

  static async findById(id) {
    const query = `
      SELECT b.*, c.name as category_name 
      FROM businesses b 
      LEFT JOIN categories c ON b.category_id = c.id
      WHERE b.id = $1
    `;
    
    try {
      const result = await pool.query(query, [id]);
      return result.rows[0];
    } catch (error) {
      console.error('Error finding business by ID:', error);
      throw error;
    }
  }

  static async create(businessData) {
    const { name, description, address, phone, email, website, category_id, opening_hours, latitude, longitude } = businessData;
    
    const query = `
      INSERT INTO businesses (name, description, address, phone, email, website, category_id, opening_hours, latitude, longitude)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `;
    
    const values = [name, description, address, phone, email, website, category_id, opening_hours, latitude, longitude];
    
    try {
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error('Error creating business:', error);
      throw error;
    }
  }

  static async update(id, businessData) {
    const fields = [];
    const values = [];
    let paramIndex = 1;

    Object.keys(businessData).forEach(key => {
      if (businessData[key] !== undefined) {
        fields.push(`${key} = $${paramIndex}`);
        values.push(businessData[key]);
        paramIndex++;
      }
    });

    if (fields.length === 0) {
      throw new Error('No fields to update');
    }

    values.push(id);
    const query = `
      UPDATE businesses 
      SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $${paramIndex}
      RETURNING *
    `;
    
    try {
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error('Error updating business:', error);
      throw error;
    }
  }

  static async delete(id) {
    const query = 'DELETE FROM businesses WHERE id = $1 RETURNING *';
    
    try {
      const result = await pool.query(query, [id]);
      return result.rows[0];
    } catch (error) {
      console.error('Error deleting business:', error);
      throw error;
    }
  }
}

module.exports = Business;
