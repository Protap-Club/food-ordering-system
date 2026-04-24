const createStripe = require('stripe');

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

const stripe = STRIPE_SECRET_KEY
  ? createStripe(STRIPE_SECRET_KEY, { apiVersion: '2026-02-25.clover' })
  : null;

module.exports = stripe;
