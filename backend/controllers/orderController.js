const Order = require('../models/Order');
const Restaurant = require('../models/Restaurant');
const MenuItem = require('../models/MenuItem');
const User = require('../models/User');
const { asyncHandler, requireObjectId } = require('../middleware/auth');

exports.createOrder = asyncHandler(async (req, res) => {
  const { restaurantId, items, deliveryAddress, paymentMethod = 'cod' } = req.body;

  requireObjectId(restaurantId, 'restaurant id');
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'At least one order item is required' });
  }
  if (!['card', 'wallet', 'cod'].includes(paymentMethod)) {
    return res.status(400).json({ error: 'Invalid payment method' });
  }

  const restaurant = await Restaurant.findById(restaurantId);
  if (!restaurant) {
    return res.status(404).json({ error: 'Restaurant not found' });
  }

  let subtotal = 0;
  const orderItems = [];

  for (const item of items) {
    requireObjectId(item.menuItemId, 'menu item id');

    const qty = Math.max(Number.parseInt(item.qty, 10) || 0, 0);
    if (!qty) continue;

    const menuItem = await MenuItem.findOne({
      _id: item.menuItemId,
      restaurant: restaurantId,
      isAvailable: true,
    });
    if (!menuItem) continue;

    const customizations = Array.isArray(item.customizations) ? item.customizations : [];
    const extraCost = customizations.reduce((sum, option) => sum + (Number(option.extra) || 0), 0);
    const linePrice = Number(menuItem.price) + extraCost;

    subtotal += linePrice * qty;
    orderItems.push({
      menuItem: menuItem._id,
      name: menuItem.name,
      price: linePrice,
      qty,
      customizations,
    });
  }

  if (!orderItems.length) {
    return res.status(400).json({ error: 'No valid menu items were found for this order' });
  }

  const deliveryFee = Number(restaurant.deliveryFee) || 0;
  const tax = Number((subtotal * 0.05).toFixed(2));
  const total = Number((subtotal + deliveryFee + tax).toFixed(2));

  if (paymentMethod === 'wallet' && req.user.wallet < total) {
    return res.status(400).json({ error: 'Insufficient wallet balance' });
  }

  const order = await Order.create({
    customer: req.user._id,
    restaurant: restaurantId,
    items: orderItems,
    deliveryAddress,
    payment: {
      method: paymentMethod,
      status: paymentMethod === 'wallet' ? 'paid' : 'pending',
    },
    subtotal,
    deliveryFee,
    tax,
    total,
    estimatedDelivery: new Date(Date.now() + ((restaurant.deliveryTime?.max || 30) * 60000)),
  });

  const loyaltyPoints = Math.floor(total / 10);
  const userUpdate = { $inc: { loyaltyPoints } };
  if (paymentMethod === 'wallet') {
    userUpdate.$inc.wallet = -total;
  }
  await User.findByIdAndUpdate(req.user._id, userUpdate);

  res.status(201).json(order);
});

exports.listOrders = asyncHandler(async (req, res) => {
  const query = req.user.role === 'customer' ? { customer: req.user._id } : {};
  const orders = await Order.find(query)
    .populate('restaurant', 'name image')
    .populate('items.menuItem', 'name image')
    .sort({ createdAt: -1 });

  res.json(orders);
});

exports.getOrder = asyncHandler(async (req, res) => {
  requireObjectId(req.params.id, 'order id');

  const order = await Order.findById(req.params.id)
    .populate('restaurant')
    .populate('customer', 'name email');

  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }

  res.json(order);
});

exports.updateOrderStatus = asyncHandler(async (req, res) => {
  requireObjectId(req.params.id, 'order id');

  const allowedStatuses = ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'];
  if (!allowedStatuses.includes(req.body.status)) {
    return res.status(400).json({ error: 'Invalid order status' });
  }

  const order = await Order.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true, runValidators: true },
  );

  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }

  res.json(order);
});
