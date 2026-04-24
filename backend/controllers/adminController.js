const User = require('../models/User');
const Order = require('../models/Order');
const Restaurant = require('../models/Restaurant');
const { asyncHandler } = require('../middleware/auth');

exports.getStats = asyncHandler(async (req, res) => {
  const [totalUsers, totalOrders, totalRestaurants, revenueResult] = await Promise.all([
    User.countDocuments(),
    Order.countDocuments(),
    Restaurant.countDocuments(),
    Order.aggregate([{ $group: { _id: null, total: { $sum: '$total' } } }]),
  ]);

  res.json({
    totalUsers,
    totalOrders,
    totalRestaurants,
    totalRevenue: revenueResult[0]?.total || 0,
  });
});

exports.getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find()
    .populate('customer', 'name email')
    .populate('restaurant', 'name')
    .sort({ createdAt: -1 })
    .limit(100);

  res.json(orders);
});
