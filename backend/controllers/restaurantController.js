const Restaurant = require('../models/Restaurant');
const MenuItem = require('../models/MenuItem');
const Review = require('../models/Review');
const { asyncHandler, escapeRegex, requireObjectId } = require('../middleware/auth');

exports.listRestaurants = asyncHandler(async (req, res) => {
  const {
    cuisine,
    priceRange,
    rating,
    dietary,
    search,
    sort,
    page = 1,
    limit = 12,
  } = req.query;

  const query = {};

  if (cuisine) query.cuisine = { $in: String(cuisine).split(',') };
  if (priceRange) query.priceRange = { $in: String(priceRange).split(',') };
  if (rating) query.rating = { $gte: Number(rating) };
  if (dietary) {
    const dietaryTerms = String(dietary).split(',').map((term) => new RegExp(escapeRegex(term), 'i'));
    query.tags = { $in: dietaryTerms };
  }
  if (search) {
    const regex = new RegExp(escapeRegex(search), 'i');
    query.$or = [{ name: regex }, { cuisine: regex }, { tags: regex }];
  }

  const sortOptions = {
    rating: { rating: -1 },
    delivery: { 'deliveryTime.min': 1 },
    price: { deliveryFee: 1 },
    newest: { createdAt: -1 },
  };

  const pageNumber = Math.max(Number.parseInt(page, 10) || 1, 1);
  const limitNumber = Math.min(Math.max(Number.parseInt(limit, 10) || 12, 1), 50);

  const [restaurants, total] = await Promise.all([
    Restaurant.find(query)
      .sort(sortOptions[sort] || { featured: -1, rating: -1 })
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber),
    Restaurant.countDocuments(query),
  ]);

  res.json({ restaurants, total, pages: Math.ceil(total / limitNumber) });
});

exports.getRestaurant = asyncHandler(async (req, res) => {
  requireObjectId(req.params.id, 'restaurant id');

  const restaurant = await Restaurant.findById(req.params.id);
  if (!restaurant) {
    return res.status(404).json({ error: 'Restaurant not found' });
  }

  const [menu, reviews] = await Promise.all([
    MenuItem.find({ restaurant: req.params.id, isAvailable: true }),
    Review.find({ restaurant: req.params.id })
      .populate('author', 'name')
      .sort({ createdAt: -1 })
      .limit(20),
  ]);

  res.json({ restaurant, menu, reviews });
});

exports.createRestaurant = asyncHandler(async (req, res) => {
  const restaurant = await Restaurant.create({ ...req.body, owner: req.user._id });
  res.status(201).json(restaurant);
});

exports.updateRestaurant = asyncHandler(async (req, res) => {
  requireObjectId(req.params.id, 'restaurant id');

  const restaurant = await Restaurant.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!restaurant) {
    return res.status(404).json({ error: 'Restaurant not found' });
  }

  res.json(restaurant);
});
