const express = require('express');
const cors = require('cors');
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

const allowedOrigins = (process.env.CORS_ORIGIN || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

const corsOptions = {
  credentials: true,
  origin(origin, callback) {
    // Allow server-to-server requests (no origin) or wildcard
    if (!origin || allowedOrigins.includes('*')) {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    // FIX: Return null instead of an error object so the response
    // isn't blocked — the browser will handle the rejected origin.
    return callback(null, false);
  },
};

// FIX: Handle preflight OPTIONS requests explicitly before any other middleware
app.options('*', cors(corsOptions));
app.use(cors(corsOptions));

app.use(express.json({ limit: '1mb' }));

mongoose.set('strictQuery', true);

app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    service: 'FoodRush API',
    health: '/api/health',
  });
});

// Health route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'FoodRush API',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
  });
});

// Mount routes
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

module.exports = app;