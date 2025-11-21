const express = require("express");
const router = express.Router();
const Business = require("../models/Business");
const BusinessImage = require("../models/BusinessImage");
const { validate, businessSchema } = require("../middleware/validation");
const { upload } = require("../config/cloudinary");
const { authenticateToken } = require("../middleware/auth"); // ← AGREGAR

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
    console.error("❌ Error fetching businesses:", error);
    console.error("Error code:", error.code);
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);

    let errorMessage = "Error fetching businesses";
    if (error.code === "ECONNREFUSED" || error.code === "ETIMEDOUT") {
      errorMessage =
        "No se pudo conectar a la base de datos. Verifica la configuración.";
    } else if (error.code === "28P01") {
      errorMessage = "Error de autenticación con la base de datos.";
    } else if (error.code === "3D000") {
      errorMessage = "La base de datos no existe.";
    } else if (error.code === "42P01") {
      errorMessage = "Una tabla no existe en la base de datos.";
    } else if (error.code === "42703") {
      errorMessage = "Una columna no existe en la base de datos.";
    }

    res.status(500).json({
      success: false,
      message: errorMessage,
      error: error.message,
      code: error.code,
      ...(process.env.NODE_ENV === "development" && {
        stack: error.stack,
        query: error.query,
      }),
    });
  }
});

// GET /api/businesses/:id - Obtener negocio por ID (público - solo aprobados)
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const business = await Business.findById(id, false); // false = no incluir pendientes

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
router.post("/", upload.array("images", 10), async (req, res) => {
  try {
    const businessData = req.body;

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

    const business = await Business.create(businessData);

    if (req.files && req.files.length > 0) {
      const imageData = req.files.map((file) => ({
        url: file.path,
        public_id: file.filename,
      }));

      await BusinessImage.createMultiple(business.id, imageData);
    }

    const businessWithImages = await Business.findById(business.id);

    res.status(201).json({
      success: true,
      data: businessWithImages,
      message: "Business created successfully",
    });
  } catch (error) {
    console.error("Error creating business:", error);

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
});

// POST /api/businesses/:id/images - Agregar imágenes (público)
router.post("/:id/images", upload.array("images", 10), async (req, res) => {
  try {
    const { id } = req.params;

    const business = await Business.findById(id);
    if (!business) {
      return res.status(404).json({
        success: false,
        message: "Business not found",
      });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No images provided",
      });
    }

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

// PUT /api/businesses/:id - Actualizar negocio (PROTEGIDO) ← CAMBIADO
router.put(
  "/:id",
  authenticateToken,
  validate(businessSchema),
  async (req, res) => {
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
  }
);

// DELETE /api/businesses/:id - Eliminar negocio (PROTEGIDO) ← CAMBIADO
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    await BusinessImage.deleteByBusinessId(id);

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

// DELETE /api/businesses/:businessId/images/:imageId - Eliminar imagen (PROTEGIDO) ← CAMBIADO
router.delete(
  "/:businessId/images/:imageId",
  authenticateToken,
  async (req, res) => {
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
  }
);

// GET /api/businesses/admin/all - Obtener todos los negocios incluyendo pendientes y rechazados (PROTEGIDO - solo admin)
// IMPORTANTE: Esta ruta debe ir ANTES de /admin/:id para que se evalúe primero
router.get("/admin/all", authenticateToken, async (req, res) => {
  try {
    const { search, category, location, limit = 1000, offset = 0 } = req.query;

    const businesses = await Business.findAll({
      search,
      category,
      location,
      limit: parseInt(limit),
      offset: parseInt(offset),
      includePending: true, // Incluir todos los estados
    });

    res.json({
      success: true,
      data: businesses,
      count: businesses.length,
    });
  } catch (error) {
    console.error("Error fetching all businesses for admin:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching businesses",
      error: error.message,
    });
  }
});

// GET /api/businesses/admin/:id - Obtener negocio por ID incluyendo pendientes (PROTEGIDO - solo admin)
// IMPORTANTE: Esta ruta debe ir DESPUÉS de /admin/all para que no capture "all" como id
router.get("/admin/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const business = await Business.findById(id, true); // true = incluir pendientes

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
    console.error("Error fetching business for admin:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching business",
      error: error.message,
    });
  }
});

// GET /api/businesses/pending/all - Obtener negocios pendientes de verificación (PROTEGIDO - solo admin)
router.get("/pending/all", authenticateToken, async (req, res) => {
  try {
    const pendingBusinesses = await Business.findPending();

    res.json({
      success: true,
      data: pendingBusinesses,
      count: pendingBusinesses.length,
    });
  } catch (error) {
    console.error("Error fetching pending businesses:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching pending businesses",
      error: error.message,
    });
  }
});

// PATCH /api/businesses/:id/approve - Aprobar negocio (PROTEGIDO - solo admin)
router.patch("/:id/approve", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const business = await Business.updateStatus(id, 'approved');

    if (!business) {
      return res.status(404).json({
        success: false,
        message: "Business not found",
      });
    }

    const businessWithImages = await Business.findById(id, true);

    res.json({
      success: true,
      data: businessWithImages,
      message: "Business approved successfully",
    });
  } catch (error) {
    console.error("Error approving business:", error);
    res.status(500).json({
      success: false,
      message: "Error approving business",
      error: error.message,
    });
  }
});

// PATCH /api/businesses/:id/reject - Rechazar negocio (PROTEGIDO - solo admin)
router.patch("/:id/reject", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const business = await Business.updateStatus(id, 'rejected');

    if (!business) {
      return res.status(404).json({
        success: false,
        message: "Business not found",
      });
    }

    res.json({
      success: true,
      data: business,
      message: "Business rejected successfully",
    });
  } catch (error) {
    console.error("Error rejecting business:", error);
    res.status(500).json({
      success: false,
      message: "Error rejecting business",
      error: error.message,
    });
  }
});

module.exports = router;
