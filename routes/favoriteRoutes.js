const express = require('express');
const router = express.Router();
const favoriteController = require('../controllers/favoriteController');
const authMiddleware = require('../middleware/authMiddleware');


router.post('/:propertyId', authMiddleware, favoriteController.addFavorite);


router.delete('/:propertyId', authMiddleware, favoriteController.removeFavorite);


router.get('/', authMiddleware, favoriteController.getFavorites);

module.exports = router; 