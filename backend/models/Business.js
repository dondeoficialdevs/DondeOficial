const pool = require("../config/database");

class Business {
  static async findAll(params = {}) {
    let query = `
      SELECT 
        b.*, 
        c.name as category_name,
        COALESCE(
          json_agg(
            json_build_object(
              'id', bi.id,
              'image_url', bi.image_url,
              'is_primary', bi.is_primary
            ) ORDER BY bi.is_primary DESC, bi.created_at ASC
          ) FILTER (WHERE bi.id IS NOT NULL), 
          '[]'
        ) as images
      FROM businesses b 
      LEFT JOIN categories c ON b.category_id = c.id
      LEFT JOIN business_images bi ON b.id = bi.business_id
      WHERE 1=1
    `;
    const values = [];
    let paramIndex = 1;

    // Filtrar por status (por defecto solo aprobados para consultas públicas)
    if (params.status !== undefined) {
      query += ` AND b.status = $${paramIndex}`;
      values.push(params.status);
      paramIndex++;
    } else if (!params.includePending) {
      // Por defecto, solo mostrar negocios aprobados en consultas públicas
      query += ` AND b.status = 'approved'`;
    }

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

    // IMPORTANTE: GROUP BY antes de ORDER BY
    query += ` GROUP BY b.id, c.name ORDER BY b.name ASC`;

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
      console.error("Error finding businesses:", error);
      throw error;
    }
  }

  static async findById(id, includePending = false) {
    let query = `
      SELECT 
        b.*, 
        c.name as category_name,
        COALESCE(
          json_agg(
            json_build_object(
              'id', bi.id,
              'image_url', bi.image_url,
              'is_primary', bi.is_primary
            ) ORDER BY bi.is_primary DESC, bi.created_at ASC
          ) FILTER (WHERE bi.id IS NOT NULL), 
          '[]'
        ) as images
      FROM businesses b 
      LEFT JOIN categories c ON b.category_id = c.id
      LEFT JOIN business_images bi ON b.id = bi.business_id
      WHERE b.id = $1
    `;
    
    // Si no se incluyen pendientes, solo mostrar aprobados
    if (!includePending) {
      query += ` AND b.status = 'approved'`;
    }
    
    query += ` GROUP BY b.id, c.name`;

    try {
      const result = await pool.query(query, [id]);
      return result.rows[0];
    } catch (error) {
      console.error("Error finding business by ID:", error);
      throw error;
    }
  }

  static async create(businessData) {
    const {
      name,
      description,
      address,
      phone,
      email,
      website,
      category_id,
      opening_hours,
      latitude,
      longitude,
      facebook_url,
      instagram_url,
      tiktok_url,
      whatsapp_url,
      status = 'pending', // Por defecto, los nuevos negocios están pendientes
    } = businessData;

    const query = `
      INSERT INTO businesses (name, description, address, phone, email, website, category_id, opening_hours, latitude, longitude, facebook_url, instagram_url, tiktok_url, whatsapp_url, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
      RETURNING *
    `;

    const values = [
      name,
      description,
      address,
      phone,
      email,
      website,
      category_id,
      opening_hours,
      latitude,
      longitude,
      facebook_url || null,
      instagram_url || null,
      tiktok_url || null,
      whatsapp_url || null,
      status,
    ];

    try {
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error("Error creating business:", error);
      throw error;
    }
  }

  static async update(id, businessData) {
    const fields = [];
    const values = [];
    let paramIndex = 1;

    Object.keys(businessData).forEach((key) => {
      if (businessData[key] !== undefined) {
        fields.push(`${key} = $${paramIndex}`);
        values.push(businessData[key]);
        paramIndex++;
      }
    });

    if (fields.length === 0) {
      throw new Error("No fields to update");
    }

    values.push(id);
    const query = `
      UPDATE businesses 
      SET ${fields.join(", ")}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $${paramIndex}
      RETURNING *
    `;

    try {
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error("Error updating business:", error);
      throw error;
    }
  }

  static async delete(id) {
    const query = "DELETE FROM businesses WHERE id = $1 RETURNING *";

    try {
      const result = await pool.query(query, [id]);
      return result.rows[0];
    } catch (error) {
      console.error("Error deleting business:", error);
      throw error;
    }
  }

  // Actualizar status de un negocio (aprobado/rechazado)
  static async updateStatus(id, status) {
    if (!['pending', 'approved', 'rejected'].includes(status)) {
      throw new Error('Invalid status. Must be pending, approved, or rejected');
    }

    const query = `
      UPDATE businesses 
      SET status = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *
    `;

    try {
      const result = await pool.query(query, [status, id]);
      return result.rows[0];
    } catch (error) {
      console.error("Error updating business status:", error);
      throw error;
    }
  }

  // Obtener negocios pendientes de verificación
  static async findPending() {
    const query = `
      SELECT 
        b.*, 
        c.name as category_name,
        COALESCE(
          json_agg(
            json_build_object(
              'id', bi.id,
              'image_url', bi.image_url,
              'is_primary', bi.is_primary
            ) ORDER BY bi.is_primary DESC, bi.created_at ASC
          ) FILTER (WHERE bi.id IS NOT NULL), 
          '[]'
        ) as images
      FROM businesses b 
      LEFT JOIN categories c ON b.category_id = c.id
      LEFT JOIN business_images bi ON b.id = bi.business_id
      WHERE b.status = 'pending'
      GROUP BY b.id, c.name
      ORDER BY b.created_at DESC
    `;

    try {
      const result = await pool.query(query);
      return result.rows;
    } catch (error) {
      console.error("Error finding pending businesses:", error);
      throw error;
    }
  }
}

module.exports = Business;
