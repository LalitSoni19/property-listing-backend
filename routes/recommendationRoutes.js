const express = require('express');
const router = express.Router();
const recommendationController = require('../controllers/recommendationController'); // Adjust path
const authMiddleware = require('../middleware/authMiddleware'); // Adjust path


router.post('/', authMiddleware, recommendationController.createRecommendation);


router.get('/received', authMiddleware, recommendationController.getReceivedRecommendations);

module.exports = router;