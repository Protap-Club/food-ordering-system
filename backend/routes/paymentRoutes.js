const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { auth } = require('../middleware/auth');

router.post('/create-intent', auth(), paymentController.createPaymentIntent);
router.post('/wallet/topup', auth(), paymentController.walletTopup);

module.exports = router;
