const MenuItem = require('../models/MenuItem');
const { asyncHandler, requireObjectId } = require('../middleware/auth');

exports.getMenu = asyncHandler(async (req, res) => {
  requireObjectId(req.params.id, 'restaurant id');

  const { dietary, category, maxPrice } = req.query;
  const query = { restaurant: req.params.id };

  if (dietary) query.dietary = { $all: String(dietary).split(',') };
  if (category) query.category = category;
  if (maxPrice) query.price = { $lte: Number(maxPrice) };

  const items = await MenuItem.find(query);
  res.json(items);
});

exports.addMenuItem = asyncHandler(async (req, res) => {
  requireObjectId(req.params.id, 'restaurant id');

  const item = await MenuItem.create({ ...req.body, restaurant: req.params.id });
  res.status(201).json(item);
});

exports.toggleAvailability = asyncHandler(async (req, res) => {
  requireObjectId(req.params.id, 'restaurant id');
  requireObjectId(req.params.itemId, 'menu item id');

  const item = await MenuItem.findById(req.params.itemId);
  if (!item) {
    return res.status(404).json({ error: 'Menu item not found' });
  }

  item.isAvailable = !item.isAvailable;
  await item.save();

  res.json(item);
});
