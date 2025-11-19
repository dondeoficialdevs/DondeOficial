const express = require("express");
const router = express.Router();
const Review = require("../models/Review");

// GET /api/reviews/business/:businessId - Obtener todas las reseñas de un negocio
router.get("/business/:businessId", async (req, res) => {
  try {
    const { businessId } = req.params;
    const reviews = await Review.findByBusinessId(businessId);
    
    res.json({
      success: true,
      data: reviews,
      count: reviews.length,
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching reviews",
      error: error.message,
    });
  }
});

// GET /api/reviews/business/:businessId/rating - Obtener promedio de calificaciones
router.get("/business/:businessId/rating", async (req, res) => {
  try {
    const { businessId } = req.params;
    const ratingData = await Review.getAverageRating(businessId);
    
    res.json({
      success: true,
      data: ratingData,
    });
  } catch (error) {
    console.error("Error fetching rating:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching rating",
      error: error.message,
    });
  }
});

// POST /api/reviews - Crear nueva reseña
router.post("/", async (req, res) => {
  try {
    const { business_id, rating, comment, user_name, user_email } = req.body;

    // Validaciones
    if (!business_id || !rating) {
      return res.status(400).json({
        success: false,
        message: "business_id and rating are required",
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5",
      });
    }

    const review = await Review.create({
      business_id: parseInt(business_id),
      rating: parseInt(rating),
      comment: comment || null,
      user_name: user_name || null,
      user_email: user_email || null,
    });

    res.status(201).json({
      success: true,
      data: review,
      message: "Review created successfully",
    });
  } catch (error) {
    console.error("Error creating review:", error);
    res.status(500).json({
      success: false,
      message: "Error creating review",
      error: error.message,
    });
  }
});

// DELETE /api/reviews/:id - Eliminar reseña (opcional, para moderación)
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const review = await Review.delete(id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    res.json({
      success: true,
      message: "Review deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting review:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting review",
      error: error.message,
    });
  }
});

module.exports = router;

