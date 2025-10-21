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
}

module.exports = Category;
