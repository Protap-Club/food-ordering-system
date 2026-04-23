# 📚 FoodRush — API & Project Documentation

## Project Overview

FoodRush is a production-grade, full-stack food ordering system built with React, Node.js/Express, and MongoDB. It goes beyond basic food apps with advanced filters, social features, multi-method payments, loyalty points, admin dashboards, and a polished dark-mode UI.

---

## 🗂️ Project Structure

```
foodrush/
├── backend/
│   ├── server.js                  # Main Express app (all routes + models)
│   ├── package.json
│   └── .env
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   └── src/
│       ├── App.jsx                # Root component
│       ├── FoodOrderApp.jsx       # Main application logic + components
│       └── FoodOrderApp.css       # Production CSS with dark theme
│
├── SETUP_GUIDE.md
└── API_DOCUMENTATION.md
```

---

## 🗄️ Database Schema

### User
```
_id           ObjectId
name          String
email         String (unique)
password      String (hashed)
role          Enum: customer | admin | restaurant
wallet        Number (₹ balance)
loyaltyPoints Number
favorites     [ObjectId → Restaurant]
address       [{ label, street, city, zip }]
createdAt     Date
```

### Restaurant
```
_id           ObjectId
name          String
description   String
cuisine       [String]
image         String (URL)
rating        Number (0-5, auto-calculated)
reviewCount   Number
priceRange    Enum: $ | $$ | $$$ | $$$$
deliveryTime  { min: Number, max: Number } (minutes)
deliveryFee   Number
minOrder      Number
address       { street, city, zip, lat, lng }
isOpen        Boolean
featured      Boolean
tags          [String]  (e.g. vegan-friendly, halal)
owner         ObjectId → User
createdAt     Date
```

### MenuItem
```
_id           ObjectId
restaurant    ObjectId → Restaurant
name          String
description   String
price         Number
image         String
category      String  (Starters, Main Course, etc.)
dietary       [Enum: vegan|vegetarian|gluten-free|halal|dairy-free|nut-free]
spiceLevel    Number (0-3)
isAvailable   Boolean
rating        Number
customizations [{ name, options: [{ label, price }] }]
```

### Order
```
_id             ObjectId
customer        ObjectId → User
restaurant      ObjectId → Restaurant
items           [{ menuItem, name, price, qty, customizations }]
status          Enum: pending|confirmed|preparing|out_for_delivery|delivered|cancelled
deliveryAddress { street, city, zip }
payment         { method: card|wallet|cod, status, stripePaymentIntentId }
subtotal        Number
deliveryFee     Number
tax             Number
total           Number
estimatedDelivery Date
createdAt       Date
```

### Review
```
_id         ObjectId
author      ObjectId → User
restaurant  ObjectId → Restaurant
menuItem    ObjectId → MenuItem
order       ObjectId → Order
rating      Number (1-5)
title       String
body        String
images      [String]
helpful     [ObjectId → User]  (users who marked helpful)
createdAt   Date
```

---

## 📡 Full API Reference

### 🔐 Authentication

#### Register
```
POST /api/auth/register
Body: { name, email, password, role? }
Response: { token, user: { id, name, email, role, wallet, loyaltyPoints } }
```

#### Login
```
POST /api/auth/login
Body: { email, password }
Response: { token, user }
```

#### Get Current User
```
GET /api/auth/me
Headers: Authorization: Bearer <token>
Response: User object
```

---

### 🏪 Restaurants

#### List Restaurants (with filters)
```
GET /api/restaurants
Query params:
  cuisine      - comma-separated: "Indian,Chinese"
  priceRange   - comma-separated: "$,$$"
  rating       - minimum: "4.0"
  dietary      - comma-separated: "vegan,halal"
  search       - text search: "pizza"
  sort         - "rating" | "delivery" | "price" | "newest"
  page         - default 1
  limit        - default 12
Response: { restaurants: [], total, pages }
```

#### Get Restaurant Details
```
GET /api/restaurants/:id
Response: { restaurant, menu: [], reviews: [] }
```

#### Create Restaurant
```
POST /api/restaurants
Auth: admin | restaurant
Body: { name, description, cuisine, priceRange, deliveryTime, deliveryFee, address, tags }
Response: Restaurant object
```

#### Update Restaurant
```
PUT /api/restaurants/:id
Auth: admin | restaurant
Body: Partial restaurant fields
Response: Updated restaurant
```

---

### 🍽️ Menu

#### Get Menu (with filters)
```
GET /api/restaurants/:id/menu
Query params:
  dietary   - comma-separated
  category  - "Main Course"
  maxPrice  - number
Response: MenuItem[]
```

#### Add Menu Item
```
POST /api/restaurants/:id/menu
Auth: admin | restaurant
Body: { name, description, price, image, category, dietary, spiceLevel, customizations }
Response: MenuItem
```

---

### 📦 Orders

#### Place Order
```
POST /api/orders
Auth: customer
Body:
{
  restaurantId: String,
  items: [{ menuItemId, qty, customizations? }],
  deliveryAddress: { street, city, zip },
  paymentMethod: "card" | "wallet" | "cod"
}
Response: Order object (includes loyaltyPoints awarded)
```

#### Get My Orders
```
GET /api/orders
Auth: required
Response: Order[] (populated with restaurant & item details)
```

#### Get Order Details
```
GET /api/orders/:id
Auth: required
Response: Fully populated Order
```

#### Update Order Status
```
PATCH /api/orders/:id/status
Auth: admin | restaurant
Body: { status: "confirmed" | "preparing" | "out_for_delivery" | "delivered" | "cancelled" }
Response: Updated order
```

---

### 💳 Payments

#### Create Stripe Payment Intent
```
POST /api/payments/create-intent
Auth: required
Body: { amount, currency? }  (amount in ₹, converted to paise internally)
Response: { clientSecret }
```

#### Top Up Wallet
```
POST /api/payments/wallet/topup
Auth: required
Body: { amount }
Response: { wallet: newBalance }
```

---

### ⭐ Reviews

#### Post Review
```
POST /api/reviews
Auth: required
Body: { restaurant, rating, title, body, images?, menuItem?, order? }
Response: Review object (restaurant rating auto-updated)
```

#### Mark Review as Helpful
```
POST /api/reviews/:id/helpful
Auth: required
Response: { helpfulCount }
Note: Toggles — calling twice removes your helpful vote
```

---

### ❤️ Favorites

#### Toggle Favorite Restaurant
```
POST /api/favorites/:restaurantId
Auth: required
Response: { favorites: [restaurantIds] }
Note: Toggles — calling twice removes from favorites
```

#### Get My Favorites
```
GET /api/favorites
Auth: required
Response: Restaurant[] (populated)
```

---

### 🔍 Search

#### Global Search
```
GET /api/search?q=butter+chicken
Response:
{
  restaurants: [{ ...restaurant }],
  menuItems: [{ ...menuItem, restaurant: { name } }]
}
```

---

### 🛠️ Admin

#### Dashboard Stats
```
GET /api/admin/stats
Auth: admin only
Response:
{
  totalUsers: Number,
  totalOrders: Number,
  totalRestaurants: Number,
  totalRevenue: Number
}
```

#### All Orders
```
GET /api/admin/orders
Auth: admin only
Response: Last 100 orders with customer and restaurant populated
```

---

## ⚙️ Frontend Component Architecture

```
FoodOrderApp (root)
├── Header
│   ├── Logo
│   ├── SearchBar
│   ├── Nav (Home | Orders | Saved)
│   ├── CartButton
│   └── UserChip
│
├── View: Home
│   ├── Hero Section
│   ├── QuickFilters (cuisine pills)
│   ├── Toolbar (filter toggle + sort)
│   ├── FilterSidebar (collapsible)
│   │   ├── Cuisine multi-select chips
│   │   ├── Price range chips
│   │   ├── Rating slider
│   │   ├── Dietary chips
│   │   └── Open Now toggle
│   └── RestaurantGrid
│       └── RestaurantCard × N
│
├── View: Orders
│   └── OrderCard × N (with reorder button)
│
├── View: Favorites
│   └── RestaurantGrid (filtered to favorites)
│
├── View: Profile
│   └── ProfileCard (wallet, points, order count)
│
├── CartPanel (slide-in sidebar)
│   ├── CartItem × N (with qty controls)
│   └── CartFooter (totals + checkout button)
│
├── RestaurantModal (full detail overlay)
│   ├── CoverImage + restaurant info
│   ├── Tab: Menu
│   │   ├── CategoryTabs
│   │   ├── DietaryFilters
│   │   └── MenuGrid → MenuItemCard × N
│   ├── Tab: Reviews
│   │   ├── RatingSummary
│   │   └── ReviewCard × N (with helpful + share)
│   └── Tab: Info
│
├── CheckoutModal (3-step wizard)
│   ├── Step 1: Delivery Address
│   ├── Step 2: Payment Method (card/wallet/COD)
│   └── Step 3: Order Review + Place Order
│
└── OrderSuccessModal
    ├── Animated confirmation
    ├── Order ID + ETA
    └── Delivery tracking steps
```

---

## 🎨 Design System

### Colors
| Token | Value | Usage |
|-------|-------|-------|
| `--bg` | `#0f0f0f` | App background |
| `--surface` | `#1a1a1a` | Cards, panels |
| `--surface2` | `#242424` | Nested surfaces |
| `--border` | `#2e2e2e` | All borders |
| `--text` | `#f0ede8` | Primary text |
| `--text2` | `#999` | Secondary text |
| `--accent` | `#ff6b35` | Primary CTA, highlights |
| `--accent2` | `#ffd23f` | Stars, secondary accent |
| `--success` | `#4caf7d` | Delivered status |
| `--error` | `#e05c5c` | Errors, cancel |

### Typography
- **Display / Headings**: Syne (700, 800 weights) — bold, geometric
- **Body / UI**: DM Sans (300–600 weights) — clean, readable

### Breakpoints
- Mobile: `< 480px` — single column grid
- Tablet: `< 768px` — 2-column grid, hidden desktop nav
- Desktop: `≥ 768px` — full layout with sidebar filters

---

## 🚦 Key Features Summary

| Feature | Backend | Frontend |
|---------|---------|----------|
| JWT Auth | ✅ | ✅ |
| Restaurant CRUD | ✅ | ✅ |
| Advanced Filters | ✅ Query params | ✅ Sidebar + chips |
| Menu with Dietary | ✅ | ✅ Badges + filters |
| Order Lifecycle | ✅ 6 statuses | ✅ Tracking UI |
| Stripe Payments | ✅ PaymentIntent | ✅ Checkout flow |
| Wallet System | ✅ | ✅ |
| Loyalty Points | ✅ Auto-awarded | ✅ Profile display |
| Reviews + Ratings | ✅ Auto-avg | ✅ Helpful votes + share |
| Favorites Toggle | ✅ | ✅ Heart button |
| Global Search | ✅ | ✅ Header bar |
| Admin Dashboard | ✅ Stats + orders | ✅ |
| Social Sharing | — | ✅ Web Share API |
| Responsive UI | — | ✅ Mobile-first |
