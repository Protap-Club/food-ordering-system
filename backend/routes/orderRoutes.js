const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { auth } = require('../middleware/auth');

router.post('/', orderController.createOrder);
router.get('/', orderController.listOrders);
router.get('/:id', orderController.getOrder);
router.patch('/:id/status', orderController.updateOrderStatus);

module.exports = router;
