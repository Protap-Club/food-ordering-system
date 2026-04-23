# FoodRush Backend

Express API for the FoodRush restaurant ordering system. It uses MongoDB/Mongoose for persistence, JWT for authentication, and Stripe PaymentIntents for the existing payment endpoint.

## Setup

```bash
npm install
cp .env.example .env
npm run dev
```

Set `MONGODB_URI`, `JWT_SECRET`, and `STRIPE_SECRET_KEY` in `.env` before using database-backed routes or payment creation.

## Scripts

- `npm run dev` starts the API with nodemon.
- `npm start` starts the API with Node.

## Base URL

The API listens on `http://localhost:5000` by default. Routes are mounted under `/api`.
