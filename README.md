# FoodRush

FoodRush is a local full-stack restaurant ordering system built from the provided source files and documentation.

## Project Structure

```text
Food-Ordering-System/
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

## Backend

```bash
cd backend
npm install
npm run dev
```

Required environment values:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/foodrush
JWT_SECRET=replace_with_a_long_random_secret
STRIPE_SECRET_KEY=sk_test_replace_me
CORS_ORIGIN=http://localhost:5173
```

## Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend environment:

```env
VITE_API_URL=http://localhost:5000/api
```

## Local URLs

- Backend API: `http://localhost:5000/api`
- Frontend app: `http://localhost:5173`
