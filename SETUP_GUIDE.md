# FoodRush Setup Guide

## Prerequisites

- Node.js 18 or newer
- npm 9 or newer
- MongoDB local instance or MongoDB Atlas URI
- Stripe account for card payments

## Project Structure

```text
foodrush/
  backend/
    server.js
    package.json
    .env.example
    .gitignore
    README.md
  frontend/
    src/
      App.jsx
      FoodOrderApp.jsx
      FoodOrderApp.css
      api.js
      main.jsx
    public/
    index.html
    package.json
    .env.example
    .gitignore
    vite.config.js
    README.md
  API_DOCUMENTATION.md
  SETUP_GUIDE.md
  README.md
```

## Backend Setup

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

Create `backend/.env` with:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/foodrush
JWT_SECRET=replace_with_a_long_random_secret
STRIPE_SECRET_KEY=sk_test_replace_me
CORS_ORIGIN=http://localhost:5173
NODE_ENV=development
```

If port `5000` is already in use, set `PORT` to a free port and update the frontend `VITE_API_URL` to match.

## Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Create `frontend/.env` with:

```env
VITE_API_URL=http://localhost:5000/api
```

Vite serves the app at `http://localhost:5173` by default.

## Stripe Setup

1. Create a Stripe account.
2. Copy a test secret key from the Stripe dashboard.
3. Put it in `backend/.env` as `STRIPE_SECRET_KEY`.

The backend keeps the documented `/api/payments/create-intent` route and returns a Stripe PaymentIntent client secret when Stripe is configured.

## Useful Commands

Backend:

```bash
npm run dev
npm start
```

Frontend:

```bash
npm run dev
npm run build
npm run preview
```

## Troubleshooting

- Backend cannot bind port: set a different `PORT` in `backend/.env`.
- MongoDB errors: confirm `MONGODB_URI` is reachable.
- Stripe payment errors: confirm `STRIPE_SECRET_KEY` is set and uses the same Stripe mode as your frontend.
- Frontend API errors: confirm `VITE_API_URL` points to the backend `/api` base path.
