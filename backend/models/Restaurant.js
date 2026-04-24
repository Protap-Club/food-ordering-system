const mongoose = require('mongoose');

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

module.exports = mongoose.model('Restaurant', restaurantSchema);
