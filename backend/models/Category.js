const pool = require('../config/database');

class Category {
  static async findAll() {
    const query = 'SELECT * FROM categories ORDER BY name ASC';
    
    try {
      const result = await pool.query(query);
      return result.rows;
    } catch (error) {
      console.error('Error finding categories:', error);
      throw error;
    }
  }

  static async findById(id) {
    const query = 'SELECT * FROM categories WHERE id = $1';
    
    try {
      const result = await pool.query(query, [id]);
      return result.rows[0];
    } catch (error) {
      console.error('Error finding category by ID:', error);
      throw error;
    }
  }

  static async create(categoryData) {
    const { name, description } = categoryData;
    
    const query = `
      INSERT INTO categories (name, description)
      VALUES ($1, $2)
      RETURNING *
    `;
    
    try {
      const result = await pool.query(query, [name, description]);
      return result.rows[0];
    } catch (error) {
      console.error('Error creating category:', error);
      throw error;
    }
  }

  // Obtener conteos de negocios por categoría (solo aprobados)
  static async getCountsByCategory() {
    const query = `
      SELECT 
        c.id,
        c.name,
        COUNT(b.id) as business_count
      FROM categories c
      LEFT JOIN businesses b ON c.id = b.category_id AND b.status = 'approved'
      GROUP BY c.id, c.name
      ORDER BY c.name ASC
    `;
    
    try {
      const result = await pool.query(query);
      return result.rows.map(row => ({
        id: row.id,
        name: row.name,
        count: parseInt(row.business_count) || 0
      }));
    } catch (error) {
      console.error('Error getting category counts:', error);
      throw error;
    }
  }
}

module.exports = Category;
