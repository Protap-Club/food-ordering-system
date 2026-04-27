const express = require('express');
const router = express.Router();
const MenuItem = require('../models/MenuItem');
const { asyncHandler, requireObjectId } = require('../middleware/auth');

router.get('/', asyncHandler(async (req, res) => {
  const items = await MenuItem.find({});
  res.json(items);
}));

router.patch('/:id/availability', asyncHandler(async (req, res) => {
  requireObjectId(req.params.id, 'menu item id');

  const item = await MenuItem.findById(req.params.id);
  if (!item) {
    return res.status(404).json({ error: 'Menu item not found' });
  }

  item.isAvailable = !item.isAvailable;
  await item.save();

  res.json(item);
}));

module.exports = router;
