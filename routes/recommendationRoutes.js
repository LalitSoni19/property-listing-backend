const express = require('express');
const router = express.Router();
const recommendationController = require('../controllers/recommendationController'); // Adjust path
const authMiddleware = require('../middleware/authMiddleware'); // Adjust path

// @route   POST api/recommendations
// @desc    Recommend a property to another user
// @access  Private
router.post('/', authMiddleware, recommendationController.createRecommendation);

// @route   GET api/recommendations/received (could also be /api/users/me/recommendations)
// @desc    Get recommendations received by the authenticated user
// @access  Private
router.get('/received', authMiddleware, recommendationController.getReceivedRecommendations);

module.exports = router;