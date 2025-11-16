const express = require("express");
const router = express.Router();
const NewsletterSubscriber = require("../models/NewsletterSubscriber");
const { validate, newsletterSchema } = require("../middleware/validation");
const { authenticateToken } = require("../middleware/auth"); // ← AGREGAR

// POST /api/newsletter/subscribe - Suscribirse al newsletter (público)
router.post("/subscribe", validate(newsletterSchema), async (req, res) => {
  try {
    const { email } = req.validatedData;

    const existingSubscriber = await NewsletterSubscriber.findByEmail(email);
    if (existingSubscriber) {
      return res.status(409).json({
        success: false,
        message: "This email is already subscribed to the newsletter",
      });
    }

    const subscriber = await NewsletterSubscriber.create(email);

    res.status(201).json({
      success: true,
      data: subscriber,
      message: "Successfully subscribed to newsletter",
    });
  } catch (error) {
    console.error("Error subscribing to newsletter:", error);
    res.status(500).json({
      success: false,
      message: "Error subscribing to newsletter",
      error: error.message,
    });
  }
});

// GET /api/newsletter/subscribers - Listar todos los suscriptores (PROTEGIDO) ← CAMBIADO
router.get("/subscribers", authenticateToken, async (req, res) => {
  try {
    const { limit = 20, offset = 0 } = req.query;

    const subscribers = await NewsletterSubscriber.findAll({
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    res.json({
      success: true,
      data: subscribers,
      count: subscribers.length,
    });
  } catch (error) {
    console.error("Error fetching subscribers:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching subscribers",
      error: error.message,
    });
  }
});

// DELETE /api/newsletter/subscribers/:id - Eliminar suscriptor (PROTEGIDO) ← YA ESTABA
router.delete("/subscribers/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const subscriber = await NewsletterSubscriber.delete(id);

    if (!subscriber) {
      return res.status(404).json({
        success: false,
        message: "Subscriber not found",
      });
    }

    res.json({
      success: true,
      message: "Subscriber deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting subscriber:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting subscriber",
      error: error.message,
    });
  }
});

module.exports = router;
