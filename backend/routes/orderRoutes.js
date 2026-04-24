const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { auth } = require('../middleware/auth');

router.post('/', auth(), orderController.createOrder);
router.get('/', auth(), orderController.listOrders);
router.get('/:id', auth(), orderController.getOrder);
router.patch('/:id/status', auth(['admin', 'restaurant']), orderController.updateOrderStatus);

module.exports = router;
