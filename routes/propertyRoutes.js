const express = require('express');
const router = express.Router();
const propertyController = require('../controllers/propertyController');
const authMiddleware = require('../middleware/authMiddleware');

// @route   POST api/properties
// @desc    Create a property
// @access  Private
router.post('/', authMiddleware, propertyController.createProperty);

// @route   GET api/properties
// @desc    Get all properties (with filtering)
// @access  Public
router.get('/', propertyController.getAllProperties);

// @route   GET api/properties/:id
// @desc    Get property by ID
// @access  Public
router.get('/:id', propertyController.getPropertyById);

// @route   PUT api/properties/:id
// @desc    Update a property
// @access  Private (Owner only)
router.put('/:id', authMiddleware, propertyController.updateProperty);

// @route   DELETE api/properties/:id
// @desc    Delete a property
// @access  Private (Owner only)
router.delete('/:id', authMiddleware, propertyController.deleteProperty);

module.exports = router;