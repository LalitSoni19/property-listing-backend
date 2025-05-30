const express = require('express');
const router = express.Router();
const propertyController = require('../controllers/propertyController');
const authMiddleware = require('../middleware/authMiddleware');


router.post('/', authMiddleware, propertyController.createProperty);


router.get('/', propertyController.getAllProperties);


router.get('/:id', propertyController.getPropertyById);


router.put('/:id', authMiddleware, propertyController.updateProperty);


router.delete('/:id', authMiddleware, propertyController.deleteProperty);

module.exports = router;