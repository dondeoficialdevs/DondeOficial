const express = require("express");
const router = express.Router();
const Category = require("../models/Category");
const { authenticateToken } = require("../middleware/auth"); // ← AGREGAR

// GET /api/categories - Listar todas las categorías (público)
router.get("/", async (req, res) => {
  try {
    const categories = await Category.findAll();

    res.json({
      success: true,
      data: categories,
      count: categories.length,
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    console.error("Error code:", error.code);

    let errorMessage = "Error fetching categories";
    if (error.code === "ECONNREFUSED" || error.code === "ETIMEDOUT") {
      errorMessage =
        "No se pudo conectar a la base de datos. Verifica la configuración.";
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

// GET /api/categories/counts - Obtener conteos de negocios por categoría (público)
// IMPORTANTE: Esta ruta debe ir ANTES de /:id para que no sea interceptada
router.get("/counts", async (req, res) => {
  try {
    const categoryCounts = await Category.getCountsByCategory();

    res.json({
      success: true,
      data: categoryCounts,
    });
  } catch (error) {
    console.error("Error fetching category counts:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching category counts",
      error: error.message,
    });
  }
});

// GET /api/categories/:id - Obtener categoría por ID (público)
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    res.json({
      success: true,
      data: category,
    });
  } catch (error) {
    console.error("Error fetching category:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching category",
      error: error.message,
    });
  }
});

// POST /api/categories - Crear nueva categoría (público)
router.post("/", async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Name is required",
      });
    }

    const category = await Category.create({ name, description });

    res.status(201).json({
      success: true,
      data: category,
      message: "Category created successfully",
    });
  } catch (error) {
    console.error("Error creating category:", error);
    res.status(500).json({
      success: false,
      message: "Error creating category",
      error: error.message,
    });
  }
});

module.exports = router;
