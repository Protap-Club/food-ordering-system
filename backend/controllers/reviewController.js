const Review = require('../models/Review');
const Restaurant = require('../models/Restaurant');
const { asyncHandler, requireObjectId } = require('../middleware/auth');

exports.createReview = asyncHandler(async (req, res) => {
  const { restaurant, rating } = req.body;

  requireObjectId(restaurant, 'restaurant id');
  if (!Number.isFinite(Number(rating)) || Number(rating) < 1 || Number(rating) > 5) {
    return res.status(400).json({ error: 'Rating must be between 1 and 5' });
  }

  const review = await Review.create({ ...req.body, author: req.user._id });
  const reviews = await Review.find({ restaurant });
  const avg = reviews.reduce((sum, current) => sum + current.rating, 0) / reviews.length;

  await Restaurant.findByIdAndUpdate(restaurant, {
    rating: Number(avg.toFixed(1)),
    reviewCount: reviews.length,
  });

  res.status(201).json(review);
});

exports.markHelpful = asyncHandler(async (req, res) => {
  requireObjectId(req.params.id, 'review id');

  const review = await Review.findById(req.params.id);
  if (!review) {
    return res.status(404).json({ error: 'Review not found' });
  }

  const existingIndex = review.helpful.findIndex((id) => id.equals(req.user._id));
  if (existingIndex > -1) {
    review.helpful.splice(existingIndex, 1);
  } else {
    review.helpful.push(req.user._id);
  }

  await review.save();
  res.json({ helpfulCount: review.helpful.length });
});
