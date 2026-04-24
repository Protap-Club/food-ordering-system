const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'foodrush_development_secret_change_me';

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

module.exports = {
  asyncHandler,
  isValidObjectId,
  escapeRegex,
  requireObjectId,
  toPublicUser,
  auth,
  JWT_SECRET,
};
