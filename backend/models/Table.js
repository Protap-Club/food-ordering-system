const mongoose = require('mongoose');

const tableSchema = new mongoose.Schema({
  restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' },
  number: { type: Number, required: true },
  floor: { type: String, default: 'Ground' },
  capacity: { type: Number, default: 2 },
  status: {
    type: String,
    enum: ['free', 'occupied', 'bill_requested'],
    default: 'free'
  },
  currentOrderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', default: null },
});

module.exports = mongoose.model('Table', tableSchema);
