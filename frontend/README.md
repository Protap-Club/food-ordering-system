# FoodRush Frontend

React/Vite frontend for the FoodRush ordering experience.

## Setup

```bash
npm install
cp .env.example .env
npm run dev
```

Set `VITE_API_URL` to the backend API URL. For local development the default is:

```env
VITE_API_URL=http://localhost:5000/api
```

The app preserves the provided FoodRush UI and uses local mock data when the API is not reachable, so the interface remains usable during first-time setup.
