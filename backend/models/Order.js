const mongoose = require('mongoose');

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

module.exports = mongoose.model('Order', orderSchema);
