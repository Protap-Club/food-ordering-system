# Food Ordering System - Application Details and Workflow

## 1. Project Overview

This project is currently a full-stack restaurant operations system built around a staff-facing POS workflow. The codebase still contains some older customer-ordering modules and APIs, but the active frontend that loads today is focused on restaurant staff operations.

The live frontend experience is centered around these operational areas:

- POS for building and placing orders
- KDS (Kitchen Display System) for kitchen status tracking
- Table Management for dine-in seating flow
- Menu Management for item search and availability toggling
- Reports for same-day sales summaries

At a high level:

- The frontend is a React + Vite app
- Global app state is managed with Zustand
- The backend is a Node.js + Express API
- MongoDB is used for persistence through Mongoose
- The UI talks to the backend through REST endpoints

## 2. Current Architecture

### Frontend

Frontend folder: `frontend/`

Important technologies:

- React 18
- Vite
- Zustand
- Axios
- Recharts
- Lucide React icons

Main frontend entry flow:

1. `frontend/src/main.jsx` mounts the app
2. `frontend/src/App.jsx` loads the staff shell
3. `frontend/src/layouts/StaffLayout.jsx` provides navigation and theme UI
4. `frontend/src/store/useAppStore.js` manages shared app state
5. Views render based on `currentView`

### Backend

Backend folder: `backend/`

Important technologies:

- Node.js
- Express
- MongoDB
- Mongoose
- dotenv

Main backend flow:

1. `backend/server.js` loads environment variables and starts the server
2. `backend/config/db.js` connects to MongoDB
3. `backend/app.js` configures middleware and mounts API routes
4. Controllers handle business logic
5. Models define stored data shapes

## 3. Actual Frontend Screens

The current app is not a public customer browsing UI. It is a staff dashboard with five main views.

### 3.1 POS View

File: `frontend/src/views/POSView.jsx`

Purpose:

- Build an order
- Choose dine-in or takeaway
- Add customer name
- Attach a table for dine-in
- Select a payment method
- Place the order
- Show an invoice after order creation

Main UI sections:

- Left side: menu browsing
- Right side: active order summary
- Payment modal
- Invoice modal

### 3.2 Kitchen Display View

File: `frontend/src/views/KDSView.jsx`

Purpose:

- Show active kitchen orders
- Separate orders by status
- Help staff move orders through kitchen workflow

Displayed statuses:

- `new`
- `preparing`
- `ready`

Orders with status `done` are excluded from the KDS display.

### 3.3 Tables View

File: `frontend/src/views/TablesView.jsx`

Purpose:

- Show all tables grouped by floor
- Show table capacity and current status
- Allow staff to select a table and jump directly into POS

Supported table statuses:

- `free`
- `occupied`
- `bill_requested`

### 3.4 Menu Manager View

File: `frontend/src/views/MenuManagerView.jsx`

Purpose:

- Search menu items
- Filter by category
- Review item details such as price, prep time, spice level, tags, rating
- Toggle item availability

This is a lightweight operational menu admin screen, not a full CRUD menu editor.

### 3.5 Reports View

File: `frontend/src/views/ReportsView.jsx`

Purpose:

- Show today’s revenue
- Show total orders today
- Show average order value
- Show payment method breakdown
- Show top-selling items

This view calculates analytics from orders already loaded into frontend state.

## 4. Shared Frontend State

File: `frontend/src/store/useAppStore.js`

The app uses one central Zustand store. This file is the core orchestrator of the frontend.

### Main state buckets

- `currentView`: active screen
- `menuItems`: all menu items loaded from backend
- `categories`: derived categories for filtering
- `activeCategory`: category selected in menu views
- `searchQuery`: current item search text
- `tables`: all tables from backend
- `selectedTableId`: currently selected table
- `activeOrder`: order currently being prepared in POS
- `heldOrders`: locally stored paused orders
- `orders`: all orders loaded from backend
- `paymentModalOpen`
- `invoiceModalOpen`
- `currentInvoice`

### Persisted state

Only `heldOrders` is persisted to local storage through Zustand persistence. That means:

- held orders survive page refreshes
- the active in-progress order does not persist the same way
- menu, tables, and orders are re-fetched from the backend

## 5. Frontend Workflow in Detail

## 5.1 Initial App Load Workflow

When the frontend starts:

1. `App.jsx` calls `fetchInitialData()`
2. The store requests three endpoints in parallel:
   - `GET /api/menu`
   - `GET /api/tables`
   - `GET /api/orders`
3. The response data is normalized into frontend state
4. Categories are derived from the returned menu data
5. If loading fails, an error toast is shown

This initial load powers almost every screen in the app.

## 5.2 POS Order Building Workflow

Files mainly involved:

- `frontend/src/components/pos/MenuPanel.jsx`
- `frontend/src/components/pos/MenuCard.jsx`
- `frontend/src/components/pos/OrderPanel.jsx`
- `frontend/src/components/pos/PaymentModal.jsx`
- `frontend/src/components/pos/InvoiceModal.jsx`
- `frontend/src/utils/invoice.js`

Detailed flow:

1. Staff opens the POS view
2. Staff searches or filters menu items
3. Clicking a menu item adds it to `activeOrder.items`
4. If the same item is added again, quantity increases instead of duplicating lines
5. Staff can set:
   - order type: `Dine In` or `Takeaway`
   - customer name
   - table assignment for dine-in flow
6. The order panel calculates:
   - subtotal
   - CGST
   - SGST
   - total
7. Staff can:
   - increase quantity
   - decrease quantity
   - remove line items
   - clear the order
   - hold the order
8. When payment is initiated, the payment modal opens
9. Staff chooses one of:
   - `UPI`
   - `Card`
   - `Cash`
10. The frontend sends the order to the backend
11. On success:
   - backend creates the order
   - frontend refreshes all data
   - invoice modal opens
   - active order is cleared

## 5.3 Held Order Workflow

Held orders are a useful operational feature for rush periods.

How it works:

1. Staff builds an order in POS
2. Clicking `Hold` moves the current active order into `heldOrders`
3. The active order is reset
4. Held orders appear in a strip inside the order panel
5. Staff can click `Resume` to restore a held order back into the active editing area

Important note:

- Held orders are local frontend state, not backend orders
- They are not visible to kitchen or reports until actually placed

## 5.4 Dine-In Table Selection Workflow

Files involved:

- `frontend/src/views/TablesView.jsx`
- `frontend/src/store/useAppStore.js`

Flow:

1. Staff opens the Tables screen
2. All tables are grouped by floor
3. Clicking a table:
   - sets that table as selected
   - sets order type to `Dine In`
   - routes the user into the POS view
4. The active order then displays the selected table number
5. When the order is placed, the backend marks the table as `occupied`
6. When the order reaches `done` or `cancelled`, the backend frees the table again

## 5.5 Kitchen Workflow

Files involved:

- `frontend/src/views/KDSView.jsx`
- `frontend/src/components/kds/KDSCard.jsx`
- `backend/controllers/orderController.js`

Flow:

1. KDS reads all orders from shared state
2. It filters out `done` orders
3. Each card shows:
   - token number
   - status
   - elapsed minutes since creation
   - order type
   - table number if available
   - ordered items and quantities
4. Staff progresses the order status in this sequence:
   - `new` -> `preparing`
   - `preparing` -> `ready`
   - `ready` -> `done`
5. Each status update calls `PATCH /api/orders/:id/status`
6. Backend updates the order and, if completed, frees the linked table

Urgency behavior:

- KDS cards track elapsed time
- Orders older than 15 minutes are visually treated as urgent

## 5.6 Menu Management Workflow

Files involved:

- `frontend/src/views/MenuManagerView.jsx`
- `backend/routes/menuRoutes.js`

Flow:

1. Menu items are loaded from backend
2. Staff searches items by name
3. Staff filters through the shared category system
4. Each item row shows operational details
5. Clicking the availability toggle calls:
   - `PATCH /api/menu/:id/availability`
6. Backend flips `isAvailable`
7. Frontend refreshes initial data

Current implementation scope:

- implemented: availability toggling
- implemented: search and category filtering
- not implemented in this screen: create item, edit item, delete item

## 5.7 Reporting Workflow

Files involved:

- `frontend/src/views/ReportsView.jsx`

Flow:

1. Reports reads the already-fetched `orders` array
2. It filters orders created today using the client’s current date
3. It computes:
   - total revenue
   - total order count
   - average order value
4. It groups orders by payment method
5. It aggregates top-selling items by quantity
6. It renders:
   - stat cards
   - pie chart for payment methods
   - bar chart for top items

Important implementation detail:

- this report is frontend-computed from loaded orders
- there is no dedicated reporting API for this screen right now

## 6. Backend API Structure

File that mounts routes: `backend/app.js`

### Actively used by the current frontend

- `GET /api/menu`
- `PATCH /api/menu/:id/availability`
- `GET /api/tables`
- `PATCH /api/tables/:id/status`
- `POST /api/orders`
- `GET /api/orders`
- `GET /api/orders/:id`
- `PATCH /api/orders/:id/status`

### Also present in the backend codebase

The backend contains more routes than the current frontend uses:

- auth routes
- restaurant routes
- payment routes
- review routes
- favorite routes
- admin routes
- search routes

These appear to come from an earlier or broader FoodRush application scope. They are still part of the backend codebase, but they are not the main drivers of the current staff dashboard frontend.

## 7. Order Creation Logic

Main file: `backend/controllers/orderController.js`

When a new order is placed:

1. Backend validates that items exist
2. For each item:
   - menu item ID is validated
   - quantity is parsed
   - menu item is fetched from MongoDB
   - item price is read from the database
3. Backend builds a trusted order item list
4. Backend calculates:
   - `subtotal`
   - `cgst` at 2.5%
   - `sgst` at 2.5%
   - `gst` at 5%
   - `total`
5. Backend generates a token in the form `T-XYZ`
6. Backend stores payment info with status set to paid
7. Backend sets order status to `new`
8. If a table is attached, backend marks the table as occupied
9. Saved order is returned to frontend

This is a good design choice because totals are recalculated on the server instead of trusting frontend totals.

## 8. Data Models

## 8.1 MenuItem

File: `backend/models/MenuItem.js`

Important fields:

- `name`
- `description`
- `price`
- `image`
- `category`
- `dietary`
- `spiceLevel`
- `isAvailable`
- `isBestseller`
- `isVeg`
- `isJain`
- `isGlutenFree`
- `tasteProfile`
- `prepTime`
- `portionSize`
- `calories`
- `gstRate`
- `emoji`
- `rating`
- `reviewCount`
- `tags`
- `ingredients`
- `allergens`
- `customisations`
- `customizations`

This is a rich schema. The frontend currently uses only part of it.

## 8.2 Table

File: `backend/models/Table.js`

Important fields:

- `number`
- `floor`
- `capacity`
- `status`
- `currentOrderId`

Status values:

- `free`
- `occupied`
- `bill_requested`

## 8.3 Order

File: `backend/models/Order.js`

Important fields used in the current flow:

- `customerName`
- `customerMobile`
- `token`
- `type`
- `tableNumber`
- `tableId`
- `items`
- `status`
- `payment`
- `subtotal`
- `cgst`
- `sgst`
- `gst`
- `total`
- `createdAt`

Supported status values in schema:

- `new`
- `preparing`
- `ready`
- `done`
- `pending`
- `confirmed`
- `out_for_delivery`
- `delivered`
- `cancelled`

Only part of this status set is used by the current staff UI.

## 9. Seed Data and Sample Content

File: `backend/seedCafeOS.js`

The project includes a large seed script that prepares:

- many menu items across categories
- tables across floors and sections
- clean initial database state

The seeded content is detailed and realistic, with:

- vegetarian and non-vegetarian flags
- Jain and gluten-free indicators
- spice levels
- allergens
- tags
- images
- prep times
- customizations

This seed data supports a polished demo or development environment.

## 10. Implemented Features

Below is the most accurate feature summary based on the current code.

### Fully implemented in the current staff frontend

- Staff navigation across POS, KDS, Tables, Menu, and Reports
- Initial data loading from backend
- Menu search
- Menu category filtering
- Add item to active order
- Quantity adjustment in order panel
- Remove item from order
- Clear order
- Hold and resume local orders
- Dine-in and takeaway order types
- Table selection from dedicated table view
- Payment method selection
- Backend order creation
- Automatic tax calculation on frontend and backend
- Invoice modal after successful order placement
- Basic print support through browser print
- Kitchen order queue view
- Kitchen status transitions
- Automatic table occupancy update when order is placed
- Automatic table release when order is completed or cancelled
- Menu availability toggling
- Daily frontend analytics and charts
- Toast notifications for failures and key actions
- Mobile drawer navigation and theme toggle

### Implemented in backend but not central to the current staff UI

- Authentication endpoints
- Restaurant listing and management
- Search endpoints
- Reviews
- Favorites
- Payment intent and wallet endpoints
- Admin statistics endpoints

### Present but only partially surfaced in the UI

- Rich menu metadata such as allergens, taste profile, calories, Jain, gluten-free, ingredients
- More order/payment schema fields than the staff frontend currently displays
- `bill_requested` table state exists, but the current frontend mostly reads it rather than actively driving that state

## 11. Workflow Summary by Role

### Cashier / Front Desk

1. Open Tables or POS
2. Pick a table if dine-in
3. Add menu items
4. Set order type and customer name if needed
5. Hold order or continue checkout
6. Take payment
7. Place order
8. Print invoice if needed

### Kitchen Staff

1. Open Kitchen view
2. See newly placed orders
3. Move orders from `new` to `preparing`
4. Move orders from `preparing` to `ready`
5. Complete orders as `done`

### Manager / Supervisor

1. Open Menu Manager to verify stock availability
2. Open Reports to review today’s performance
3. Open Tables to track floor occupancy

## 12. API and Data Flow End-to-End

This is the most important practical flow in the current app:

1. Frontend loads menu, tables, and orders
2. Staff creates an active order locally
3. On payment selection, frontend posts the order
4. Backend validates menu item IDs and prices
5. Backend stores the order and sets table occupancy
6. Frontend refreshes all live data
7. KDS immediately sees the new order
8. Kitchen progresses the order status
9. Backend updates status and frees table when finished
10. Reports automatically reflect completed and newly created orders because they are computed from the shared order list

## 13. Important Technical Notes and Current Gaps

This section is useful for anyone maintaining or extending the app.

### Current codebase reality

- The root-level older docs describe a broader customer-ordering platform, but the current frontend code is a staff operations dashboard.
- The backend is somewhat hybrid: it supports both the staff POS flow and legacy/broader FoodRush APIs.

### Practical gaps or inconsistencies visible in the current implementation

- Menu Manager only toggles availability; it does not yet provide full create/edit/delete item management.
- Reports are computed on the client, so very large order volumes may eventually justify a dedicated backend reporting endpoint.
- The invoice modal displays `Paid via {currentInvoice.paymentMethod}`, but the backend stores payment under `payment.method`, so the displayed label may not always reflect the saved structure correctly.
- Authentication middleware exists, but the current POS order and table flows are effectively public from the frontend’s perspective.
- The app includes order schema values for delivery-style workflows, but the current UI mainly handles dine-in and takeaway.

## 14. Folder-Level Reference

### Root

- `README.md`: basic project intro
- `API_DOCUMENTATION.md`: older API-focused documentation
- `SETUP_GUIDE.md`: setup notes
- `PROJECT_CONTEXT.txt`: older comprehensive app notes
- `APPLICATION_WORKFLOW.md`: this detailed current-state guide

### Backend

- `server.js`: bootstraps backend server
- `app.js`: middleware and route mounting
- `config/`: database and Stripe setup
- `controllers/`: API business logic
- `models/`: MongoDB schemas
- `routes/`: Express routers
- `seedCafeOS.js`: database seeding script

### Frontend

- `src/App.jsx`: root app switching logic
- `src/layouts/StaffLayout.jsx`: main dashboard shell
- `src/store/useAppStore.js`: main state and actions
- `src/views/`: primary screens
- `src/components/pos/`: POS-specific components
- `src/components/kds/`: kitchen card UI
- `src/components/ui/`: reusable UI elements
- `src/utils/`: invoice and print helpers

## 15. Recommended Future Enhancements

These are logical next improvements based on the current structure.

- Add full CRUD actions for menu management
- Add dedicated table actions for bill request and reservation handling
- Add authentication and role-based access for staff users
- Add backend reporting endpoints for scalable analytics
- Add printer-friendly invoice templates with stronger payment field mapping
- Add live refresh or socket updates for KDS instead of refresh-based state reloads
- Add delivery workflow screens if delivery support is still a product goal
- Align older documentation with the current staff-dashboard architecture

## 16. Final Summary

The application currently works best when understood as a restaurant operations dashboard rather than a customer marketplace app.

Its strongest implemented workflows are:

- taking orders through a POS
- assigning dine-in tables
- sending orders to the kitchen queue
- progressing kitchen statuses
- controlling item availability
- reviewing daily sales

The backend and database structure are broader than the current frontend, which is good for future expansion, but the present-day product experience is clearly centered on staff operations inside a cafe or restaurant.
