require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const createStripe = require('stripe');

const app = express();

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/foodrush';
const JWT_SECRET = process.env.JWT_SECRET || 'foodrush_development_secret_change_me';
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

const stripe = STRIPE_SECRET_KEY
  ? createStripe(STRIPE_SECRET_KEY, { apiVersion: '2026-02-25.clover' })
  : null;

if (!process.env.JWT_SECRET && process.env.NODE_ENV === 'production') {
  console.warn('JWT_SECRET is not set. Configure a strong secret before production use.');
}

const defaultOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
];

const allowedOrigins = (process.env.CORS_ORIGIN || process.env.CLIENT_URL || defaultOrigins.join(','))
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

const corsOptions = {
  credentials: true,
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    const error = new Error(`CORS blocked request from origin: ${origin}`);
    error.statusCode = 403;
    return callback(error);
  },
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '1mb' }));

mongoose.set('strictQuery', true);

// Schemas and models
const userSchema = new mongoose.Schema({
  name: { type: String, trim: true },
  email: { type: String, unique: true, lowercase: true, trim: true },
  password: String,
  role: { type: String, enum: ['customer', 'admin', 'restaurant'], default: 'customer' },
  wallet: { type: Number, default: 0, min: 0 },
  loyaltyPoints: { type: Number, default: 0, min: 0 },
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' }],
  address: [{ label: String, street: String, city: String, zip: String }],
  createdAt: { type: Date, default: Date.now },
});

const restaurantSchema = new mongoose.Schema({
  name: { type: String, trim: true },
  description: String,
  cuisine: [String],
  image: String,
  coverImage: String,
  rating: { type: Number, default: 0, min: 0, max: 5 },
  reviewCount: { type: Number, default: 0, min: 0 },
  priceRange: { type: String, enum: ['$', '$$', '$$$', '$$$$'], default: '$$' },
  deliveryTime: { min: Number, max: Number },
  deliveryFee: { type: Number, default: 0, min: 0 },
  minOrder: { type: Number, default: 0, min: 0 },
  address: { street: String, city: String, zip: String, lat: Number, lng: Number },
  isOpen: { type: Boolean, default: true },
  featured: { type: Boolean, default: false },
  tags: [String],
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
});

const menuItemSchema = new mongoose.Schema({
  restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' },
  name: { type: String, trim: true },
  description: String,
  price: { type: Number, min: 0 },
  image: String,
  category: String,
  dietary: [{
    type: String,
    enum: ['vegan', 'vegetarian', 'gluten-free', 'halal', 'dairy-free', 'nut-free'],
  }],
  spiceLevel: { type: Number, min: 0, max: 3, default: 0 },
  isAvailable: { type: Boolean, default: true },
  rating: { type: Number, default: 0, min: 0, max: 5 },
  reviewCount: { type: Number, default: 0, min: 0 },
  customizations: [{ name: String, options: [{ label: String, price: Number }] }],
});

const orderSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' },
  items: [{
    menuItem: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem' },
    name: String,
    price: Number,
    qty: Number,
    customizations: [{ name: String, choice: String, extra: Number }],
  }],
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'],
    default: 'pending',
  },
  deliveryAddress: { street: String, city: String, zip: String },
  payment: {
    method: { type: String, enum: ['card', 'wallet', 'cod'], default: 'cod' },
    status: { type: String, default: 'pending' },
    stripePaymentIntentId: String,
  },
  subtotal: Number,
  deliveryFee: Number,
  tax: Number,
  total: Number,
  estimatedDelivery: Date,
  rating: Number,
  review: String,
  createdAt: { type: Date, default: Date.now },
});

const reviewSchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' },
  menuItem: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem' },
  order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
  rating: { type: Number, min: 1, max: 5 },
  title: String,
  body: String,
  images: [String],
  helpful: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model('User', userSchema);
const Restaurant = mongoose.model('Restaurant', restaurantSchema);
const MenuItem = mongoose.model('MenuItem', menuItemSchema);
const Order = mongoose.model('Order', orderSchema);
const Review = mongoose.model('Review', reviewSchema);

const asyncHandler = (handler) => (req, res, next) => {
  Promise.resolve(handler(req, res, next)).catch(next);
};

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const escapeRegex = (value) => String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const requireObjectId = (id, label = 'id') => {
  if (!isValidObjectId(id)) {
    const error = new Error(`Invalid ${label}`);
    error.statusCode = 400;
    throw error;
  }
};

const toPublicUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  wallet: user.wallet,
  loyaltyPoints: user.loyaltyPoints,
});

const auth = (roles = []) => asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  let decoded;
  try {
    decoded = jwt.verify(token, JWT_SECRET);
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }

  const user = await User.findById(decoded.id).select('-password');
  if (!user) {
    return res.status(401).json({ error: 'Invalid token' });
  }

  if (roles.length && !roles.includes(user.role)) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  req.user = user;
  next();
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'FoodRush API',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
  });
});

// Auth routes
app.post('/api/auth/register', asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required' });
  }

  const normalizedEmail = String(email).toLowerCase().trim();
  const existingUser = await User.findOne({ email: normalizedEmail });
  if (existingUser) {
    return res.status(400).json({ error: 'Email already registered' });
  }

  const hash = await bcrypt.hash(password, 12);
  const user = await User.create({
    name: String(name).trim(),
    email: normalizedEmail,
    password: hash,
    role: role || 'customer',
  });
  const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });

  res.status(201).json({ token, user: toPublicUser(user) });
}));

app.post('/api/auth/login', asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const user = await User.findOne({ email: String(email).toLowerCase().trim() });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(400).json({ error: 'Invalid credentials' });
  }

  const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, user: toPublicUser(user) });
}));

app.get('/api/auth/me', auth(), (req, res) => {
  res.json(req.user);
});

// Restaurant routes
app.get('/api/restaurants', asyncHandler(async (req, res) => {
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
}));

app.get('/api/restaurants/:id', asyncHandler(async (req, res) => {
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
}));

app.post('/api/restaurants', auth(['admin', 'restaurant']), asyncHandler(async (req, res) => {
  const restaurant = await Restaurant.create({ ...req.body, owner: req.user._id });
  res.status(201).json(restaurant);
}));

app.put('/api/restaurants/:id', auth(['admin', 'restaurant']), asyncHandler(async (req, res) => {
  requireObjectId(req.params.id, 'restaurant id');

  const restaurant = await Restaurant.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!restaurant) {
    return res.status(404).json({ error: 'Restaurant not found' });
  }

  res.json(restaurant);
}));

// Menu routes
app.get('/api/restaurants/:id/menu', asyncHandler(async (req, res) => {
  requireObjectId(req.params.id, 'restaurant id');

  const { dietary, category, maxPrice } = req.query;
  const query = { restaurant: req.params.id, isAvailable: true };

  if (dietary) query.dietary = { $all: String(dietary).split(',') };
  if (category) query.category = category;
  if (maxPrice) query.price = { $lte: Number(maxPrice) };

  const items = await MenuItem.find(query);
  res.json(items);
}));

app.post('/api/restaurants/:id/menu', auth(['admin', 'restaurant']), asyncHandler(async (req, res) => {
  requireObjectId(req.params.id, 'restaurant id');

  const item = await MenuItem.create({ ...req.body, restaurant: req.params.id });
  res.status(201).json(item);
}));

// Order routes
app.post('/api/orders', auth(), asyncHandler(async (req, res) => {
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
}));

app.get('/api/orders', auth(), asyncHandler(async (req, res) => {
  const query = req.user.role === 'customer' ? { customer: req.user._id } : {};
  const orders = await Order.find(query)
    .populate('restaurant', 'name image')
    .populate('items.menuItem', 'name image')
    .sort({ createdAt: -1 });

  res.json(orders);
}));

app.get('/api/orders/:id', auth(), asyncHandler(async (req, res) => {
  requireObjectId(req.params.id, 'order id');

  const order = await Order.findById(req.params.id)
    .populate('restaurant')
    .populate('customer', 'name email');

  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }

  res.json(order);
}));

app.patch('/api/orders/:id/status', auth(['admin', 'restaurant']), asyncHandler(async (req, res) => {
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
}));

// Payment routes
app.post('/api/payments/create-intent', auth(), asyncHandler(async (req, res) => {
  if (!stripe) {
    return res.status(503).json({ error: 'Stripe is not configured. Add STRIPE_SECRET_KEY to backend/.env.' });
  }

  const amount = Number(req.body.amount);
  const currency = String(req.body.currency || 'inr').toLowerCase();

  if (!Number.isFinite(amount) || amount <= 0) {
    return res.status(400).json({ error: 'A positive amount is required' });
  }

  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(amount * 100),
    currency,
    automatic_payment_methods: { enabled: true },
    metadata: { userId: req.user._id.toString() },
  });

  res.json({ clientSecret: paymentIntent.client_secret });
}));

app.post('/api/payments/wallet/topup', auth(), asyncHandler(async (req, res) => {
  const amount = Number(req.body.amount);

  if (!Number.isFinite(amount) || amount <= 0) {
    return res.status(400).json({ error: 'A positive top-up amount is required' });
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $inc: { wallet: amount } },
    { new: true, runValidators: true },
  );

  res.json({ wallet: user.wallet });
}));

// Review routes
app.post('/api/reviews', auth(), asyncHandler(async (req, res) => {
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
}));

app.post('/api/reviews/:id/helpful', auth(), asyncHandler(async (req, res) => {
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
}));

// Favorites routes
app.post('/api/favorites/:restaurantId', auth(), asyncHandler(async (req, res) => {
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
}));

app.get('/api/favorites', auth(), asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate('favorites');
  res.json(user.favorites);
}));

// Admin routes
app.get('/api/admin/stats', auth(['admin']), asyncHandler(async (req, res) => {
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
}));

app.get('/api/admin/orders', auth(['admin']), asyncHandler(async (req, res) => {
  const orders = await Order.find()
    .populate('customer', 'name email')
    .populate('restaurant', 'name')
    .sort({ createdAt: -1 })
    .limit(100);

  res.json(orders);
}));

// Search route
app.get('/api/search', asyncHandler(async (req, res) => {
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
}));

app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.method} ${req.originalUrl} not found` });
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || err.status || 500;

  if (err.name === 'ValidationError') {
    return res.status(400).json({ error: err.message });
  }
  if (err.name === 'CastError') {
    return res.status(400).json({ error: 'Invalid identifier' });
  }
  if (err.code === 11000) {
    return res.status(409).json({ error: 'Duplicate record' });
  }

  console.error(err);
  res.status(statusCode).json({
    error: statusCode === 500 ? 'Internal server error' : err.message,
  });
});

const startServer = async () => {
  try {
    await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
    console.log('MongoDB connected');
  } catch (err) {
    console.error(`MongoDB connection failed: ${err.message}`);
    console.error('The API is still starting so health checks and non-database diagnostics can respond.');
  }

  const server = app.listen(PORT, () => {
    console.log(`FoodRush API running on http://localhost:${PORT}`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`Port ${PORT} is already in use. Set PORT to a free port in backend/.env.`);
      process.exit(1);
    }

    console.error(`Server failed to start: ${err.message}`);
    process.exit(1);
  });

  const shutdown = async (signal) => {
    console.log(`${signal} received. Closing FoodRush API.`);
    await mongoose.connection.close().catch(() => undefined);
    server.close(() => process.exit(0));
  };

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
};

if (require.main === module) {
  startServer();
}

module.exports = app;
