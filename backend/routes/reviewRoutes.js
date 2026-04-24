const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { auth } = require('../middleware/auth');

router.post('/', auth(), reviewController.createReview);
router.post('/:id/helpful', auth(), reviewController.markHelpful);

module.exports = router;
