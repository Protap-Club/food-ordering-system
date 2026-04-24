const User = require('../models/User');
const Restaurant = require('../models/Restaurant');
const { asyncHandler, requireObjectId } = require('../middleware/auth');

exports.toggleFavorite = asyncHandler(async (req, res) => {
  requireObjectId(req.params.restaurantId, 'restaurant id');

  const restaurant = await Restaurant.findById(req.params.restaurantId);
  if (!restaurant) {
    return res.status(404).json({ error: 'Restaurant not found' });
  }

  const user = await User.findById(req.user._id);
  const existingIndex = user.favorites.findIndex((id) => id.equals(req.params.restaurantId));

  if (existingIndex > -1) {
    user.favorites.splice(existingIndex, 1);
  } else {
    user.favorites.push(req.params.restaurantId);
  }

  await user.save();
  res.json({ favorites: user.favorites });
});

exports.getFavorites = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate('favorites');
  res.json(user.favorites);
});
