const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

const authRoutes = require('./routes/authRoutes');
const restaurantRoutes = require('./routes/restaurantRoutes');
const orderRoutes = require('./routes/orderRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const favoriteRoutes = require('./routes/favoriteRoutes');
const adminRoutes = require('./routes/adminRoutes');
const searchRoutes = require('./routes/searchRoutes');
const tableRoutes = require('./routes/tableRoutes');
const menuRoutes = require('./routes/menuRoutes');

dotenv.config();
const app = express();
const configuredOrigins = (process.env.CORS_ORIGIN || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

// ✅ Manual CORS — no cors package, no env var dependency
app.use((req, res, next) => {
  const origin = req.headers.origin;
  const allowedOrigins = configuredOrigins.length > 0
    ? configuredOrigins
    : [
        'https://food-ordering-system-nu.vercel.app/',
        'http://localhost:5173',
        'http://localhost:3000',
      ];

  if (!origin || allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin || '*');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,PATCH,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  }

  // Handle preflight immediately
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }

  next();
});

app.use(express.json({ limit: '1mb' }));
mongoose.set('strictQuery', true);

app.get('/', (req, res) => {
  res.json({ status: 'ok', service: 'FoodRush API', health: '/api/health' });
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'FoodRush API',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/tables', tableRoutes);
app.use('/api/menu', menuRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.method} ${req.originalUrl} not found` });
});

// Global error handler
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || err.status || 500;
  if (err.name === 'ValidationError') return res.status(400).json({ error: err.message });
  if (err.name === 'CastError') return res.status(400).json({ error: 'Invalid identifier' });
  if (err.code === 11000) return res.status(409).json({ error: 'Duplicate record' });
  console.error(err);
  res.status(statusCode).json({
    error: statusCode === 500 ? 'Internal server error' : err.message,
  });
});

module.exports = app;
``