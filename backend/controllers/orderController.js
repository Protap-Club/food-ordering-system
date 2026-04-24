const Order = require('../models/Order');
const Restaurant = require('../models/Restaurant');
const MenuItem = require('../models/MenuItem');
const Table = require('../models/Table');
const User = require('../models/User');
const { asyncHandler, requireObjectId } = require('../middleware/auth');

exports.createOrder = asyncHandler(async (req, res) => {
  const { 
    restaurantId, 
    items, 
    paymentMethod = 'Cash',
    type = 'Dine In',
    customerName,
    customerMobile,
    tableNumber,
    tableId
  } = req.body;

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'At least one order item is required' });
  }

  let subtotal = 0;
  const orderItems = [];

  for (const item of items) {
    requireObjectId(item.menuItemId || item._id, 'menu item id');

    const qty = Math.max(Number.parseInt(item.qty, 10) || 0, 0);
    if (!qty) continue;

    const menuItem = await MenuItem.findById(item.menuItemId || item._id);
    if (!menuItem) continue;

    const linePrice = Number(menuItem.price);
    subtotal += linePrice * qty;
    orderItems.push({
      menuItem: menuItem._id,
      name: menuItem.name,
      price: linePrice,
      qty,
    });
  }

  if (!orderItems.length) {
    return res.status(400).json({ error: 'No valid menu items were found for this order' });
  }

  const cgst = Number((subtotal * 0.025).toFixed(2));
  const sgst = Number((subtotal * 0.025).toFixed(2));
  const gst = Number((subtotal * 0.05).toFixed(2));
  const total = Number((subtotal + gst).toFixed(2));

  // Generate a simple token (T-100 to T-999)
  const token = `T-${Math.floor(100 + Math.random() * 900)}`;

  const order = await Order.create({
    token,
    type,
    customerName,
    customerMobile,
    tableNumber,
    tableId,
    items: orderItems,
    payment: {
      method: paymentMethod,
      status: 'paid',
    },
    subtotal,
    cgst,
    sgst,
    gst,
    total,
    status: 'new'
  });

  if (tableId) {
    await Table.findByIdAndUpdate(tableId, { status: 'occupied', currentOrderId: order._id });
  }

  res.status(201).json(order);
});

exports.listOrders = asyncHandler(async (req, res) => {
  // Return all orders for POS
  const orders = await Order.find({})
    .populate('items.menuItem', 'name emoji')
    .sort({ createdAt: -1 });

  res.json(orders);
});

exports.getOrder = asyncHandler(async (req, res) => {
  requireObjectId(req.params.id, 'order id');

  const order = await Order.findById(req.params.id);

  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }

  res.json(order);
});

exports.updateOrderStatus = asyncHandler(async (req, res) => {
  requireObjectId(req.params.id, 'order id');

  const allowedStatuses = ['new', 'preparing', 'ready', 'done', 'cancelled'];
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
  
  // If order is done or cancelled, free up the table
  if (['done', 'cancelled'].includes(req.body.status) && order.tableId) {
    await Table.findByIdAndUpdate(order.tableId, { status: 'free', currentOrderId: null });
  }

  res.json(order);
});
