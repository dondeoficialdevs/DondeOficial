const express = require('express');
const router = express.Router();
const Business = require('../models/Business');

// GET /api/businesses - List all businesses with filters
router.get('/', async (req, res) => {
  try {
    const {
      search,
      category,
      location,
      limit = 20,
      offset = 0
    } = req.query;

    const businesses = await Business.findAll({
      search,
      category,
      location,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      success: true,
      data: businesses,
      count: businesses.length
    });
  } catch (error) {
    console.error('Error fetching businesses:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching businesses',
      error: error.message
    });
  }
});

// GET /api/businesses/:id - Get business by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const business = await Business.findById(id);

    if (!business) {
      return res.status(404).json({
        success: false,
        message: 'Business not found'
      });
    }

    res.json({
      success: true,
      data: business
    });
  } catch (error) {
    console.error('Error fetching business:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching business',
      error: error.message
    });
  }
});

// POST /api/businesses - Create new business
router.post('/', async (req, res) => {
  try {
    const businessData = req.body;

    // Basic validation
    if (!businessData.name || !businessData.description) {
      return res.status(400).json({
        success: false,
        message: 'Name and description are required'
      });
    }

    const business = await Business.create(businessData);

    res.status(201).json({
      success: true,
      data: business,
      message: 'Business created successfully'
    });
  } catch (error) {
    console.error('Error creating business:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating business',
      error: error.message
    });
  }
});

// PUT /api/businesses/:id - Update business
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const businessData = req.body;

    const business = await Business.update(id, businessData);

    if (!business) {
      return res.status(404).json({
        success: false,
        message: 'Business not found'
      });
    }

    res.json({
      success: true,
      data: business,
      message: 'Business updated successfully'
    });
  } catch (error) {
    console.error('Error updating business:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating business',
      error: error.message
    });
  }
});

// DELETE /api/businesses/:id - Delete business
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const business = await Business.delete(id);

    if (!business) {
      return res.status(404).json({
        success: false,
        message: 'Business not found'
      });
    }

    res.json({
      success: true,
      message: 'Business deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting business:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting business',
      error: error.message
    });
  }
});

module.exports = router;
