# Trackora — Hardware Store Management (Frontend)

A modern React single-page application for managing a hardware store: products,
categories, suppliers, stock movements, point-of-sale orders, customers,
reporting, and role-based user management. It is the web client for the
[Trackora REST API backend](#connecting-to-the-backend) and ships with JWT
authentication, an
ERP-style design system, and role-aware navigation.

> Built for stores that deal in cement, iron sheets, paint, pipes, tiles, nails,
> electrical cables, and the like — fast inventory, trustworthy stock counts, and
> at-a-glance sales insight.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Screens](#screens)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [Project Structure](#project-structure)
- [Architecture Notes](#architecture-notes)
- [Authentication & Roles](#authentication--roles)
- [Connecting to the Backend](#connecting-to-the-backend)
- [Design System](#design-system)
- [Building for Production](#building-for-production)
- [Troubleshooting](#troubleshooting)
- [License](#license)

---

## Features

- **Authentication** — JWT login with silent access-token refresh and automatic
  logout when the session can't be renewed.
- **Dashboard** — KPI cards (products, sales, orders, profit, low/out of stock,
  customers), a 14-day sales chart, best-sellers, and low-stock alerts.
- **Products** — searchable, filterable, paginated catalogue with category and
  low-stock filters, image upload, and live stock badges.
- **Categories & Suppliers** — full CRUD with inline modal forms.
- **Stock In / Stock Out** — multi-line movement entry that adjusts product
  quantities, with a client-side guard against removing more than is in stock.
- **Orders (POS)** — build an order from a live-totalled cart; creating it
  deducts stock, and Managers/Admins can cancel to restore stock.
- **Customers** — full CRUD.
- **Reports** — daily/monthly sales, profit & margin, best sellers, and low
  stock, with selectable time periods.
- **User Management** — Admin-only create/edit/deactivate of Staff, Manager, and
  Admin accounts.
- **Profile & Security** — update your profile and change your password.
- **Role-aware UI** — navigation and action buttons appear only for roles that
  are permitted to use them, backed by route guards.
- **UX** — toast notifications, confirm dialogs, loading and empty states, and a
  responsive layout with a collapsible sidebar.

---

## Tech Stack

| Layer            | Technology                                  |
|------------------|---------------------------------------------|
| Framework        | React 19                                    |
| Build tool       | Vite                                        |
| Routing          | React Router 7                              |
| HTTP client      | Axios (with JWT refresh interceptor)        |
| Auth tokens      | `jwt-decode`, `localStorage`                |
| Notifications    | React Toastify                              |
| Icons            | React Icons (Feather / Ionicons)            |
| Styling          | Hand-built CSS design system (CSS variables)|
| Linting          | ESLint 10 (flat config)                     |

No CSS framework or data-fetching library is required — the design system and a
small `useFetch` hook are built in.

---

## Screens

| Route              | Page            | Access            |
|--------------------|-----------------|-------------------|
| `/login`           | Login           | Public            |
| `/dashboard`       | Dashboard       | All roles         |
| `/products`        | Products        | All (edit: M/A)   |
| `/categories`      | Categories      | All (edit: M/A)   |
| `/suppliers`       | Suppliers       | All (edit: M/A)   |
| `/stock-in`        | Stock In        | All roles         |
| `/stock-out`       | Stock Out       | All roles         |
| `/orders`          | Orders          | All (cancel: M/A) |
| `/customers`       | Customers       | All roles         |
| `/reports`         | Reports         | All roles         |
| `/users`           | User Management | Admin only        |
| `/profile`         | My Profile      | All roles         |
| `/change-password` | Change Password | All roles         |

*M/A = Manager or Admin. Read access is open to all authenticated users; create,
edit, and delete are gated per the backend's permission rules.*

---

## Prerequisites

- **Node.js 18+** (20+ recommended)
- **npm** (bundled with Node)
- A running instance of the **Trackora backend** API (see
  [Connecting to the Backend](#connecting-to-the-backend))

---

## Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Create your environment file
cp .env.example .env        # then edit if your API URL differs

# 3. Start the dev server
npm run dev
```

The app runs at `http://localhost:5173/`. Sign in with an account created on
the backend (an Admin can be created there via `createsuperuser`).

---

## Environment Variables

Configuration is read from a `.env` file at the project root. Vite only exposes
variables prefixed with `VITE_`.

| Variable        | Description                          | Default                       |
|-----------------|--------------------------------------|-------------------------------|
| `VITE_API_URL`  | Base URL of the Trackora REST API    | `http://127.0.0.1:8000/api`   |

```env
# .env
VITE_API_URL=http://127.0.0.1:8000/api
```

> Restart the dev server after changing `.env` — Vite reads it at startup.

---

## Available Scripts

| Command           | Description                                  |
|-------------------|----------------------------------------------|
| `npm run dev`     | Start the Vite dev server with HMR           |
| `npm run build`   | Produce an optimized production build in `dist/` |
| `npm run preview` | Serve the production build locally           |
| `npm run lint`    | Run ESLint over the project                  |

---

## Project Structure

```text
trackora-frontend/
├── public/
├── src/
│   ├── api/                 # Axios instance + per-resource API clients
│   │   ├── axios.js         # JWT attach + transparent refresh-on-401
│   │   ├── resource.js      # Generic DRF CRUD factory
│   │   ├── authApi.js       # login / profile / password / admin users
│   │   ├── productsApi.js   # products (+ image upload helpers)
│   │   ├── categoriesApi.js
│   │   ├── suppliersApi.js
│   │   ├── customersApi.js
│   │   ├── stockApi.js      # stockIn + stockOut
│   │   ├── salesApi.js      # orders + cancel()
│   │   └── reportsApi.js
│   ├── assets/
│   ├── components/
│   │   ├── common/          # Button, Input, Select, Modal, DataTable, Badge,
│   │   │                    # Card, Pagination, Spinner, ConfirmDialog, RoleGate…
│   │   ├── layout/          # Sidebar, Topbar, Layout (app shell)
│   │   ├── cards/           # StatCard
│   │   └── charts/          # BarChart, HBarList (dependency-free)
│   ├── context/
│   │   └── AuthContext.jsx  # auth state, login/logout, role helpers
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── useDebounce.js
│   │   └── useFetch.js
│   ├── pages/
│   │   ├── auth/            # Login
│   │   ├── dashboard/       # Dashboard
│   │   ├── products/        # ProductsList, ProductForm
│   │   ├── categories/      # CategoriesList
│   │   ├── suppliers/       # SuppliersList
│   │   ├── stock/           # StockInList, StockOutList, StockMovementForm…
│   │   ├── sales/           # OrdersList, OrderForm
│   │   ├── customers/       # CustomersList
│   │   ├── users/           # UsersList (Admin)
│   │   ├── profile/         # Profile, ChangePassword
│   │   ├── reports/         # Reports
│   │   └── NotFound.jsx
│   ├── routes/
│   │   ├── AppRoutes.jsx    # route table + app shell
│   │   └── ProtectedRoute.jsx  # role-aware guard (allow={[...]})
│   ├── utils/               # constants, formatters, apiError, pagination
│   ├── styles/index.css     # design system
│   ├── App.jsx
│   └── main.jsx
├── .env / .env.example
├── eslint.config.js
├── vite.config.js
└── package.json
```

---

## Architecture Notes

- **API clients** are thin wrappers over a shared `createResource()` factory, so
  every resource gets consistent `list / get / create / update / remove`
  methods. DRF list responses (`{ count, results }`) and bare arrays are both
  normalised via `utils/pagination.js`.
- **`useFetch`** is a minimal data hook (`{ data, loading, error, refetch }`);
  list pages manage their own fetch + pagination + filter state.
- **Errors** are normalised by `utils/apiError.js` into a single message plus a
  per-field map, which feeds inline form validation and toast messages.
- **`RoleGate`** hides UI a role can't use; **`ProtectedRoute`** enforces it at
  the route level — UI gating is cosmetic, the backend remains the source of truth.

---

## Authentication & Roles

On login the app stores the access and refresh tokens and the user profile. Every
request carries the access token; on a `401` the Axios interceptor refreshes the
token once and replays the request (queuing any requests that arrive mid-refresh).
If the refresh fails, the session is cleared and the user is redirected to login.

| Role        | Capabilities                                                        |
|-------------|---------------------------------------------------------------------|
| **Admin**   | Everything, including user management.                               |
| **Manager** | Manage products, categories, suppliers, stock, orders, and reports. |
| **Staff**   | Record stock in/out and create orders/customers.                    |

---

## Connecting to the Backend

This client targets the Trackora Django REST Framework API. Point `VITE_API_URL`
at your running backend (default `http://127.0.0.1:8000/api`) and ensure the
backend's `CORS_ALLOWED_ORIGINS` includes this app's origin
(`http://localhost:5173`).

Endpoints consumed include:

- `POST /auth/login/`, `POST /auth/refresh/`, `GET/PATCH /auth/profile/`,
  `POST /auth/change-password/`, `GET/POST /auth/users/`
- `/categories/`, `/suppliers/`, `/products/`
- `/stock-in/`, `/stock-out/`
- `/customers/`, `/orders/`, `POST /orders/<id>/cancel/`
- `/reports/dashboard/`, `/low-stock/`, `/daily-sales/`, `/monthly-sales/`,
  `/profit/`, `/best-selling/`

> **Note on field names:** the backend documents the order payload
> (`line_items`). The stock-in/out nested-items key is configurable via the
> `itemsKey` prop on the stock list pages (defaults to `items`), and the
> dashboard/report widgets read response fields defensively. Align these with
> your serializers if your field names differ.

---

## Design System

An ERP-inspired palette tuned for trust and clarity (defined as CSS variables in
`src/styles/index.css`):

| Purpose   | Color      | Hex       |
|-----------|------------|-----------|
| Primary   | Deep Blue  | `#1E3A8A` |
| Secondary | Slate Gray | `#334155` |
| Accent    | Orange     | `#F97316` |
| Success   | Green      | `#22C55E` |
| Warning   | Amber      | `#F59E0B` |
| Danger    | Red        | `#EF4444` |
| Background| Light Gray | `#F8FAFC` |

The UI uses a dark sidebar, a white top bar, rounded cards with subtle shadows,
status badges (Active / Low Stock / Out of Stock / Pending), and color-coded
action buttons (success for stock-in/save, danger for delete/stock-out).

---

## Building for Production

```bash
npm run build      # outputs static assets to dist/
npm run preview    # preview the build locally
```

Deploy the contents of `dist/` to any static host (Netlify, Vercel, Nginx,
S3 + CloudFront, etc.). Because the app uses client-side routing, configure your
host to **rewrite all unknown paths to `index.html`** so deep links resolve.

Set `VITE_API_URL` at build time to your production API URL.

---

## Troubleshooting

- **Network / CORS errors** — confirm the backend is running and its
  `CORS_ALLOWED_ORIGINS` includes `http://localhost:5173`.
- **Login succeeds but data is empty** — verify `VITE_API_URL` ends with `/api`
  and matches your backend.
- **Refreshing a deep link 404s in production** — add the SPA `index.html`
  fallback/rewrite on your host.
- **Stock-in/out save fails with a field error** — your serializer's nested
  items key may differ; adjust the `itemsKey` prop on the stock pages.

---

## License

Proprietary — © Trackora. All rights reserved.
