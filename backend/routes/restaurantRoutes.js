const express = require('express');
const router = express.Router();
const restaurantController = require('../controllers/restaurantController');
const menuController = require('../controllers/menuController');
const { auth } = require('../middleware/auth');

router.get('/', restaurantController.listRestaurants);
router.get('/:id', restaurantController.getRestaurant);
router.post('/', auth(['admin', 'restaurant']), restaurantController.createRestaurant);
router.put('/:id', auth(['admin', 'restaurant']), restaurantController.updateRestaurant);

router.get('/:id/menu', menuController.getMenu);
router.post('/:id/menu', auth(['admin', 'restaurant']), menuController.addMenuItem);

module.exports = router;
