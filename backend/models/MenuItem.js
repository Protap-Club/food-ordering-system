const mongoose = require('mongoose');

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
  isBestseller: { type: Boolean, default: false },
  emoji: { type: String, default: "🍽️" },
  rating: { type: Number, default: 0, min: 0, max: 5 },
  reviewCount: { type: Number, default: 0, min: 0 },
  customizations: [{ name: String, options: [{ label: String, price: Number }] }],
});

module.exports = mongoose.model('MenuItem', menuItemSchema);
