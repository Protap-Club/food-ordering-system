const stripe = require('../config/stripe');
const User = require('../models/User');
const { asyncHandler } = require('../middleware/auth');

exports.createPaymentIntent = asyncHandler(async (req, res) => {
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
});

exports.walletTopup = asyncHandler(async (req, res) => {
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
});
