const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  customerName: String,
  customerMobile: String,
  token: String,
  type: { type: String, enum: ['Dine In', 'Takeaway', 'Delivery'], default: 'Dine In' },
  tableNumber: Number,
  tableId: String,
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
    enum: ['new', 'preparing', 'ready', 'done', 'pending', 'confirmed', 'out_for_delivery', 'delivered', 'cancelled'],
    default: 'new',
  },
  deliveryAddress: { street: String, city: String, zip: String },
  payment: {
    method: { type: String, enum: ['card', 'wallet', 'cod'], default: 'cod' },
    status: { type: String, default: 'pending' },
    stripePaymentIntentId: String,
  },
  subtotal: Number,
  cgst: Number,
  sgst: Number,
  gst: Number,
  deliveryFee: Number,
  tax: Number,
  total: Number,
  estimatedDelivery: Date,
  rating: Number,
  review: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Order', orderSchema);
