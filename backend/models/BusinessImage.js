const pool = require("../config/database");
const { cloudinary } = require("../config/cloudinary");

class BusinessImage {
  // Crear múltiples imágenes
  static async createMultiple(businessId, imageData) {
    const query = `
      INSERT INTO business_images (business_id, image_url, cloudinary_public_id, is_primary)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;

    try {
      const results = [];
      for (let i = 0; i < imageData.length; i++) {
        const img = imageData[i];
        const isPrimary = i === 0; // La primera imagen es la principal

        const result = await pool.query(query, [
          businessId,
          img.url,
          img.public_id,
          isPrimary,
        ]);

        results.push(result.rows[0]);
      }
      return results;
    } catch (error) {
      console.error("Error creating business images:", error);
      throw error;
    }
  }

  // Obtener todas las imágenes de un negocio
  static async findByBusinessId(businessId) {
    const query = `
      SELECT * FROM business_images 
      WHERE business_id = $1 
      ORDER BY is_primary DESC, created_at ASC
    `;

    try {
      const result = await pool.query(query, [businessId]);
      return result.rows;
    } catch (error) {
      console.error("Error finding business images:", error);
      throw error;
    }
  }

  // Eliminar imagen (también la elimina de Cloudinary)
  static async delete(id) {
    // Primero obtener la imagen para tener el public_id
    const getQuery = "SELECT * FROM business_images WHERE id = $1";
    const deleteQuery = "DELETE FROM business_images WHERE id = $1 RETURNING *";

    try {
      const imageResult = await pool.query(getQuery, [id]);
      const image = imageResult.rows[0];

      if (!image) {
        return null;
      }

      // Eliminar de Cloudinary
      await cloudinary.uploader.destroy(image.cloudinary_public_id);

      // Eliminar de la base de datos
      const result = await pool.query(deleteQuery, [id]);
      return result.rows[0];
    } catch (error) {
      console.error("Error deleting business image:", error);
      throw error;
    }
  }

  // Eliminar todas las imágenes de un negocio
  static async deleteByBusinessId(businessId) {
    try {
      // Obtener todas las imágenes del negocio
      const images = await this.findByBusinessId(businessId);

      // Eliminar cada imagen de Cloudinary
      for (const image of images) {
        await cloudinary.uploader.destroy(image.cloudinary_public_id);
      }

      // Eliminar de la base de datos
      const query = "DELETE FROM business_images WHERE business_id = $1";
      await pool.query(query, [businessId]);

      return true;
    } catch (error) {
      console.error("Error deleting business images:", error);
      throw error;
    }
  }
}

module.exports = BusinessImage;
