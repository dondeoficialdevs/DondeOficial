const express = require("express");
const router = express.Router();
const Business = require("../models/Business");
const BusinessImage = require("../models/BusinessImage");
const { validate, businessSchema } = require("../middleware/validation");
const { upload } = require("../config/cloudinary");

// GET /api/businesses - Listar todos los negocios con filtros (público)
router.get("/", async (req, res) => {
  try {
    const { search, category, location, limit = 20, offset = 0 } = req.query;

    const businesses = await Business.findAll({
      search,
      category,
      location,
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    res.json({
      success: true,
      data: businesses,
      count: businesses.length,
    });
  } catch (error) {
    console.error("Error fetching businesses:", error);
    console.error("Error code:", error.code);
    console.error("Error details:", {
      message: error.message,
      stack: error.stack,
    });
    
    // Mensajes más específicos según el tipo de error
    let errorMessage = "Error fetching businesses";
    if (error.code === "ECONNREFUSED" || error.code === "ETIMEDOUT") {
      errorMessage = "No se pudo conectar a la base de datos. Verifica la configuración.";
    } else if (error.code === "28P01") {
      errorMessage = "Error de autenticación con la base de datos.";
    } else if (error.code === "3D000") {
      errorMessage = "La base de datos no existe.";
    }
    
    res.status(500).json({
      success: false,
      message: errorMessage,
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

// GET /api/businesses/:id - Obtener negocio por ID (público)
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const business = await Business.findById(id);

    if (!business) {
      return res.status(404).json({
        success: false,
        message: "Business not found",
      });
    }

    res.json({
      success: true,
      data: business,
    });
  } catch (error) {
    console.error("Error fetching business:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching business",
      error: error.message,
    });
  }
});

// POST /api/businesses - Crear nuevo negocio CON imágenes (público)
router.post(
  "/",
  upload.array("images", 10), // Permite hasta 10 imágenes con el campo 'images'
  async (req, res) => {
    try {
      // Los datos del negocio vienen en req.body
      const businessData = req.body;

      // Validar datos del negocio (sin las imágenes)
      const { error } = businessSchema.validate(businessData);
      if (error) {
        return res.status(400).json({
          success: false,
          message: "Validation error",
          errors: error.details.map((detail) => ({
            field: detail.path.join("."),
            message: detail.message,
          })),
        });
      }

      // Crear el negocio
      const business = await Business.create(businessData);

      // Si hay imágenes, guardarlas
      if (req.files && req.files.length > 0) {
        const imageData = req.files.map((file) => ({
          url: file.path, // Cloudinary devuelve la URL en file.path
          public_id: file.filename, // Cloudinary devuelve el public_id en file.filename
        }));

        await BusinessImage.createMultiple(business.id, imageData);
      }

      // Obtener el negocio completo con las imágenes
      const businessWithImages = await Business.findById(business.id);

      res.status(201).json({
        success: true,
        data: businessWithImages,
        message: "Business created successfully",
      });
    } catch (error) {
      console.error("Error creating business:", error);

      // Manejar error de duplicación
      if (error.code === "23505") {
        return res.status(409).json({
          success: false,
          message: "A business with this name or email already exists",
        });
      }

      res.status(500).json({
        success: false,
        message: "Error creating business",
        error: error.message,
      });
    }
  }
);

// POST /api/businesses/:id/images - Agregar imágenes a un negocio existente
router.post("/:id/images", upload.array("images", 10), async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar que el negocio existe
    const business = await Business.findById(id);
    if (!business) {
      return res.status(404).json({
        success: false,
        message: "Business not found",
      });
    }

    // Verificar que hay imágenes
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No images provided",
      });
    }

    // Guardar las imágenes
    const imageData = req.files.map((file) => ({
      url: file.path,
      public_id: file.filename,
    }));

    const images = await BusinessImage.createMultiple(id, imageData);

    res.status(201).json({
      success: true,
      data: images,
      message: "Images added successfully",
    });
  } catch (error) {
    console.error("Error adding images:", error);
    res.status(500).json({
      success: false,
      message: "Error adding images",
      error: error.message,
    });
  }
});

// DELETE /api/businesses/:businessId/images/:imageId - Eliminar una imagen específica
router.delete("/:businessId/images/:imageId", async (req, res) => {
  try {
    const { imageId } = req.params;

    const deletedImage = await BusinessImage.delete(imageId);

    if (!deletedImage) {
      return res.status(404).json({
        success: false,
        message: "Image not found",
      });
    }

    res.json({
      success: true,
      message: "Image deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting image:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting image",
      error: error.message,
    });
  }
});

// PUT /api/businesses/:id - Actualizar negocio (no requiere autenticación)
router.put("/:id", validate(businessSchema), async (req, res) => {
  try {
    const { id } = req.params;
    const businessData = req.validatedData;

    const business = await Business.update(id, businessData);

    if (!business) {
      return res.status(404).json({
        success: false,
        message: "Business not found",
      });
    }

    res.json({
      success: true,
      data: business,
      message: "Business updated successfully",
    });
  } catch (error) {
    console.error("Error updating business:", error);

    // Manejar error de duplicación
    if (error.code === "23505") {
      return res.status(409).json({
        success: false,
        message: "A business with this name or email already exists",
      });
    }

    res.status(500).json({
      success: false,
      message: "Error updating business",
      error: error.message,
    });
  }
});

// DELETE /api/businesses/:id - Eliminar negocio (no requiere autenticación)
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Primero eliminar las imágenes de Cloudinary
    await BusinessImage.deleteByBusinessId(id);

    // Luego eliminar el negocio
    const business = await Business.delete(id);

    if (!business) {
      return res.status(404).json({
        success: false,
        message: "Business not found",
      });
    }

    res.json({
      success: true,
      message: "Business deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting business:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting business",
      error: error.message,
    });
  }
});

module.exports = router;
