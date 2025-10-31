const express = require("express");
const router = express.Router();
const Lead = require("../models/Lead");
const { validate, leadSchema } = require("../middleware/validation");
const { authenticateToken } = require("../middleware/auth");

// POST /api/leads - Crear nuevo lead (público)
router.post("/", validate(leadSchema), async (req, res) => {
  try {
    const { full_name, email, subject, message } = req.validatedData;

    // Verificar duplicado
    const existingLead = await Lead.checkDuplicate(email, full_name);
    if (existingLead) {
      return res.status(409).json({
        success: false,
        message: "A lead with this email and name already exists",
      });
    }

    const lead = await Lead.create({ full_name, email, subject, message });

    res.status(201).json({
      success: true,
      data: lead,
      message: "Lead created successfully",
    });
  } catch (error) {
    console.error("Error creating lead:", error);
    res.status(500).json({
      success: false,
      message: "Error creating lead",
      error: error.message,
    });
  }
});

// GET /api/leads - Listar todos los leads (requiere autenticación)
router.get("/", authenticateToken, async (req, res) => {
  try {
    const { limit = 20, offset = 0 } = req.query;

    const leads = await Lead.findAll({
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    res.json({
      success: true,
      data: leads,
      count: leads.length,
    });
  } catch (error) {
    console.error("Error fetching leads:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching leads",
      error: error.message,
    });
  }
});

// GET /api/leads/:id - Obtener lead por ID (requiere autenticación)
router.get("/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const lead = await Lead.findById(id);

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found",
      });
    }

    res.json({
      success: true,
      data: lead,
    });
  } catch (error) {
    console.error("Error fetching lead:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching lead",
      error: error.message,
    });
  }
});

module.exports = router;
