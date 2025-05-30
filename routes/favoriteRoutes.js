const express = require('express');
const router = express.Router();
const favoriteController = require('../controllers/favoriteController'); // Adjust path
const authMiddleware = require('../middleware/authMiddleware'); // Adjust path

// @route   POST api/favorites/:propertyId
// @desc    Add a property to user's favorites
// @access  Private
router.post('/:propertyId', authMiddleware, favoriteController.addFavorite);

// @route   DELETE api/favorites/:propertyId
// @desc    Remove a property from user's favorites
// @access  Private
router.delete('/:propertyId', authMiddleware, favoriteController.removeFavorite);

// @route   GET api/favorites
// @desc    Get all favorite properties for the authenticated user
// @access  Private
router.get('/', authMiddleware, favoriteController.getFavorites);

module.exports = router; 