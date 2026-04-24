const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { auth } = require('../middleware/auth');

router.get('/stats', auth(['admin']), adminController.getStats);
router.get('/orders', auth(['admin']), adminController.getAllOrders);

module.exports = router;
