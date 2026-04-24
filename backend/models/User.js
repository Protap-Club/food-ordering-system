const mongoose = require('mongoose');

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

module.exports = mongoose.model('User', userSchema);
