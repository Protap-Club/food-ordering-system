const Restaurant = require('../models/Restaurant');
const MenuItem = require('../models/MenuItem');
const { asyncHandler, escapeRegex } = require('../middleware/auth');

exports.search = asyncHandler(async (req, res) => {
  const q = String(req.query.q || '').trim();
  if (!q) {
    return res.json({ restaurants: [], menuItems: [] });
  }

  const regex = new RegExp(escapeRegex(q), 'i');
  const [restaurants, items] = await Promise.all([
    Restaurant.find({ $or: [{ name: regex }, { cuisine: regex }, { tags: regex }] }).limit(5),
    MenuItem.find({ name: regex, isAvailable: true }).populate('restaurant', 'name').limit(5),
  ]);

  res.json({ restaurants, menuItems: items });
});
