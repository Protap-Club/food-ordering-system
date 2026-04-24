const express = require('express');
const router = express.Router();
const favoriteController = require('../controllers/favoriteController');
const { auth } = require('../middleware/auth');

router.post('/:restaurantId', auth(), favoriteController.toggleFavorite);
router.get('/', auth(), favoriteController.getFavorites);

module.exports = router;
