# Frontend Architecture — MarketFlow Client

> **Stack:** React 19 · Vite 8 · TanStack Query · Zustand · React Router 8 · Tailwind CSS 4

---

## Architecture Pattern

The frontend follows a **Feature-Sliced + Component-Based** architecture. Code is organized by **domain feature** (auth, products, cart, etc.), with each feature owning its own API layer, custom hooks, and components. Shared UI and cross-cutting concerns live in top-level directories.

```
                    ┌──────────────────────────────────┐
                    │           main.jsx                │
                    │  StrictMode → BrowserRouter       │
                    │  → AppProviders → App             │
                    └──────────────┬───────────────────┘
                                   │
                    ┌──────────────▼───────────────────┐
                    │           App.jsx                 │
                    │  Auth Bootstrap (getMe)           │
                    │  → AppRoutes                      │
                    └──────────────┬───────────────────┘
                                   │
              ┌────────────────────┼────────────────────┐
              ▼                    ▼                    ▼
     ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
     │ PublicLayout  │    │ AdminLayout  │    │ ProtectedRoute│
     │  (Navbar,     │    │  (Sidebar,   │    │  (Auth Gate)  │
     │   Footer)     │    │   Header)    │    │               │
     └──────┬───────┘    └──────┬───────┘    └───────────────┘
            │                   │
            ▼                   ▼
     ┌──────────────────────────────────┐
     │             PAGES                │
     │  (Compose features + components) │
     └──────────────┬───────────────────┘
                    │
       ┌────────────┼────────────┐
       ▼            ▼            ▼
┌────────────┐ ┌──────────┐ ┌────────────┐
│  FEATURES  │ │COMPONENTS│ │   STORES   │
│ (Domain    │ │ (Shared  │ │  (Zustand  │
│  modules)  │ │   UI)    │ │   Global)  │
└─────┬──────┘ └──────────┘ └────────────┘
      │
      ▼
┌────────────┐
│  API Layer │──▶  Axios Instance  ──▶  Backend API
│  (per      │
│  feature)  │
└────────────┘
```

---

## Directory Structure

```
client/
├── index.html                   # HTML entry point
├── vite.config.js               # Vite build configuration
├── package.json
├── .env / .env.example
├── eslint.config.js
├── .prettierrc
│
├── public/                      # Static assets (favicon, etc.)
├── dist/                        # Production build output
│
└── src/
    ├── main.jsx                 # Application bootstrap
    ├── App.jsx                  # Root component (auth hydration)
    ├── index.css                # Global styles + Tailwind imports
    │
    ├── app/                     # Application-level providers
    │   └── AppProviders.jsx     # QueryClientProvider (TanStack Query)
    │
    ├── routes/                  # Routing configuration
    │   ├── AppRoutes.jsx        # All route definitions
    │   ├── ProtectedRoute.jsx   # Auth & role guard wrapper
    │   └── routePaths.js        # Centralized route path constants
    │
    ├── layouts/                 # Page layout shells
    │   ├── PublicLayout.jsx     # Navbar + Footer (customer-facing)
    │   └── AdminLayout.jsx      # Sidebar + Header (admin panel)
    │
    ├── pages/                   # Page-level components (route targets)
    │   ├── public/              # Unauthenticated pages
    │   │   ├── HomePage.jsx
    │   │   ├── ProductsPage.jsx
    │   │   ├── ProductDetailsPage.jsx
    │   │   └── NotFoundPage.jsx
    │   │
    │   ├── auth/                # Authentication pages
    │   │   ├── LoginPage.jsx
    │   │   ├── RegisterPage.jsx
    │   │   ├── ForgotPasswordPage.jsx
    │   │   └── ResetPasswordPage.jsx
    │   │
    │   ├── user/                # Authenticated user pages
    │   │   ├── CartPage.jsx
    │   │   ├── CheckoutPage.jsx
    │   │   ├── ProfilePage.jsx
    │   │   ├── OrdersPage.jsx
    │   │   ├── OrderDetailPage.jsx
    │   │   └── WishlistPage.jsx
    │   │
    │   └── admin/               # Admin dashboard pages
    │       ├── AdminDashboardPage.jsx
    │       ├── AdminProductsPage.jsx
    │       ├── AdminProductFormPage.jsx
    │       ├── AdminCategoriesPage.jsx
    │       ├── AdminOrdersPage.jsx
    │       ├── AdminOrderDetailPage.jsx
    │       ├── AdminUsersPage.jsx
    │       └── AdminCouponsPage.jsx
    │
    ├── features/                # Feature-sliced domain modules
    │   ├── auth/
    │   │   ├── authApi.js       # Auth API calls (login, register, etc.)
    │   │   ├── hooks/
    │   │   │   └── useAuth.js   # Auth mutation hooks
    │   │   └── components/      # Auth-specific UI components
    │   │
    │   ├── products/
    │   │   ├── productApi.js    # Product API calls
    │   │   └── hooks/
    │   │       └── useProducts.js  # Product query hooks
    │   │
    │   ├── categories/
    │   │   ├── categoryApi.js   # Category API calls
    │   │   └── hooks/           # Category query hooks
    │   │
    │   ├── cart/
    │   │   ├── cartApi.js       # Cart API calls
    │   │   └── hooks/           # Cart query/mutation hooks
    │   │
    │   ├── orders/
    │   │   ├── orderApi.js      # Order API calls
    │   │   └── hooks/           # Order query hooks
    │   │
    │   ├── wishlist/
    │   │   ├── wishlistApi.js   # Wishlist API calls
    │   │   └── hooks/           # Wishlist query/mutation hooks
    │   │
    │   ├── user/
    │   │   ├── userApi.js       # User profile API calls
    │   │   └── hooks/           # User query/mutation hooks
    │   │
    │   └── admin/
    │       ├── adminApi.js      # Admin-specific API calls
    │       └── hooks/           # Admin query/mutation hooks
    │
    ├── components/              # Shared reusable UI components
    │   ├── common/              # Generic components
    │   │   ├── Badge.jsx
    │   │   ├── ConfirmDialog.jsx
    │   │   ├── EmptyState.jsx
    │   │   ├── FormInput.jsx
    │   │   ├── FormTextarea.jsx
    │   │   ├── PageLoader.jsx
    │   │   ├── Pagination.jsx
    │   │   ├── StarRating.jsx
    │   │   └── Toast.jsx
    │   │
    │   └── home/                # Homepage-specific components
    │       ├── HeroCarousel.jsx
    │       ├── ProductCard.jsx
    │       ├── ProductSection.jsx
    │       ├── CategorySection.jsx
    │       ├── FlashSaleStrip.jsx
    │       ├── PromoBanner.jsx
    │       ├── BenefitsRow.jsx
    │       └── NewsletterSection.jsx
    │
    ├── stores/                  # Global state management (Zustand)
    │   ├── authStore.js         # Auth state (user, token, hydration)
    │   └── toastStore.js        # Toast notification state
    │
    ├── lib/                     # Infrastructure & utilities
    │   ├── axiosInstance.js     # Configured Axios client + interceptors
    │   ├── apiError.js          # API error normalization
    │   └── config.js            # Environment config (API URL)
    │
    ├── data/                    # Static data / mock content
    │   └── homeData.js          # Homepage static content
    │
    ├── assets/                  # Static assets (images, icons)
    └── styles/                  # Additional style files (if needed)
```

---

## Layer Responsibilities

### 1. Bootstrap Layer (`main.jsx`)

Composes the application shell in strict order:

```
StrictMode
  └── BrowserRouter          (React Router)
        └── AppProviders      (TanStack Query)
              └── App          (Root component)
```

### 2. App Root (`App.jsx`)

- **Auth Hydration:** On mount, checks for stored `accessToken` and calls `getMe()` to validate the session
- If valid → populates Zustand auth store
- If invalid → clears auth state
- Shows a loading spinner until hydration completes
- Renders `<AppRoutes />` once ready

### 3. Routing Layer (`routes/`)

| File | Purpose |
|------|---------|
| `AppRoutes.jsx` | Declarative route tree mapping paths → page components |
| `ProtectedRoute.jsx` | Auth guard — redirects unauthenticated users; supports `allowedRoles` for RBAC |
| `routePaths.js` | Centralized path constants to avoid hardcoded strings |

**Route Groups:**

```
/                        → PublicLayout
├── /                    → HomePage
├── /products            → ProductsPage
├── /products/:slug      → ProductDetailsPage
├── /login               → LoginPage
├── /register            → RegisterPage
├── /forgot-password     → ForgotPasswordPage
├── /reset-password/:token → ResetPasswordPage
├── /cart        🔒      → CartPage
├── /checkout    🔒      → CheckoutPage
├── /profile     🔒      → ProfilePage
├── /orders      🔒      → OrdersPage
├── /orders/:id  🔒      → OrderDetailPage
└── /wishlist    🔒      → WishlistPage

/admin           🔒👑    → AdminLayout
├── /dashboard           → AdminDashboardPage
├── /products            → AdminProductsPage
├── /products/new        → AdminProductFormPage
├── /products/:id/edit   → AdminProductFormPage
├── /categories          → AdminCategoriesPage
├── /orders              → AdminOrdersPage
├── /orders/:id          → AdminOrderDetailPage
├── /users               → AdminUsersPage
└── /coupons             → AdminCouponsPage

/*                       → NotFoundPage

🔒 = Requires authentication
👑 = Requires admin role
```

### 4. Layouts Layer (`layouts/`)

| Layout | Used By | Contains |
|--------|---------|----------|
| `PublicLayout` | All customer-facing pages | Navbar, Footer, `<Outlet />` |
| `AdminLayout` | All admin pages | Sidebar navigation, Header, `<Outlet />` |

### 5. Pages Layer (`pages/`)

- **One page per route** — each page is the top-level component rendered by the router
- Pages **compose** features, shared components, and hooks
- Organized by access level: `public/`, `auth/`, `user/`, `admin/`

### 6. Features Layer (`features/`) — The Core

Each feature module is self-contained with a consistent internal structure:

```
features/<domain>/
├── <domain>Api.js          # API call functions (Axios)
├── hooks/
│   └── use<Domain>.js      # TanStack Query hooks (useQuery / useMutation)
└── components/             # Feature-specific UI (optional)
```

**Data flow within a feature:**

```
Page Component
      │
      │  calls hook
      ▼
  useProducts()            ← TanStack Query hook
      │
      │  calls API function
      ▼
  productApi.getProducts() ← Axios call via apiClient
      │
      │  HTTP request
      ▼
  Backend API (/api/v1/products)
```

### 7. Components Layer (`components/`)

- **`common/`** — Generic, reusable UI primitives (Badge, FormInput, Pagination, Toast, etc.)
- **`home/`** — Homepage-specific composed components (HeroCarousel, ProductCard, PromoBanner, etc.)
- All components are **presentational** — they receive data via props

### 8. Stores Layer (`stores/` — Zustand)

Zustand handles **global client-side state** that doesn't belong to server state:

| Store | State | Purpose |
|-------|-------|---------|
| `authStore` | `user`, `accessToken`, `isHydrated` | Authentication state with localStorage persistence |
| `toastStore` | Toast messages | UI notification state |

**Key Pattern:** Auth state is manually synced with `localStorage` for persistence across page refreshes. TanStack Query handles all server-state caching.

### 9. Lib / Infrastructure Layer (`lib/`)

| File | Purpose |
|------|---------|
| `axiosInstance.js` | Pre-configured Axios client with base URL, timeout, auth interceptor, and 401 auto-logout |
| `apiError.js` | Normalizes API errors into a consistent shape for UI consumption |
| `config.js` | Reads `VITE_API_URL` from environment |

---

## State Management Strategy

The application uses a **dual-state** strategy, cleanly separating server state from client state:

```
┌─────────────────────────────────────────────────────┐
│                  STATE MANAGEMENT                   │
├─────────────────────┬───────────────────────────────┤
│   SERVER STATE      │      CLIENT STATE             │
│   (TanStack Query)  │      (Zustand)                │
├─────────────────────┼───────────────────────────────┤
│ • Products list     │ • Current user                │
│ • Categories        │ • Access token                │
│ • Cart items        │ • Hydration flag              │
│ • Orders            │ • Toast notifications         │
│ • Reviews           │                               │
│ • Wishlist          │                               │
│ • Admin data        │                               │
├─────────────────────┼───────────────────────────────┤
│ Auto caching,       │ Manual localStorage sync      │
│ refetching,         │ Simple get/set actions         │
│ background updates  │                               │
└─────────────────────┴───────────────────────────────┘
```

---

## Data Fetching Pattern

```
                ┌───────────────┐
                │  Page / UI    │
                │  Component    │
                └───────┬───────┘
                        │  calls
                        ▼
                ┌───────────────┐
                │  Custom Hook  │    useProducts(), useAuth(), etc.
                │  (TanStack    │    ← Manages loading, error, cache
                │   Query)      │
                └───────┬───────┘
                        │  delegates
                        ▼
                ┌───────────────┐
                │  API Function │    productApi.getAll(), authApi.login()
                │  (Feature     │    ← Pure async functions
                │   API Layer)  │
                └───────┬───────┘
                        │  calls
                        ▼
                ┌───────────────┐
                │  Axios        │    apiClient (axiosInstance.js)
                │  Instance     │    ← Token injection, error normalization
                └───────┬───────┘
                        │  HTTP
                        ▼
                ┌───────────────┐
                │  Backend API  │    /api/v1/*
                └───────────────┘
```

**TanStack Query Configuration:**
- `retry: 1` — Retry failed queries once
- `refetchOnWindowFocus: false` — Don't refetch when tab regains focus

---

## Authentication Flow

```
┌──────────┐     POST /auth/login     ┌──────────┐
│  Login   │ ──────────────────────▶  │  Backend  │
│  Page    │                          │  API      │
└──────────┘                          └────┬─────┘
      ▲                                    │
      │              { user, accessToken } │
      │  ◀─────────────────────────────────┘
      │
      ▼
┌────────────────────────────────────┐
│        Zustand Auth Store          │
│  ┌──────────────────────────┐     │
│  │ setAuth({ user, token }) │     │
│  │ → localStorage.set(...)  │     │
│  └──────────────────────────┘     │
└────────────────────────────────────┘
      │
      ▼
┌────────────────────────────────────┐
│      Axios Request Interceptor     │
│  Authorization: Bearer <token>     │
│  (reads from localStorage)         │
└────────────────────────────────────┘
      │
      ▼
┌────────────────────────────────────┐
│      Axios Response Interceptor    │
│  If 401 → clearAuth() → logout    │
└────────────────────────────────────┘
```

---

## Build & Tooling

| Tool | Version | Purpose |
|------|---------|---------|
| **Vite** | 8.x | Dev server, HMR, production bundler |
| **React** | 19.x | UI library |
| **Tailwind CSS** | 4.x | Utility-first CSS via `@tailwindcss/vite` plugin |
| **ESLint** | 10.x | Code linting with React Hooks + Refresh plugins |
| **Prettier** | 3.x | Code formatting |
| **Lucide React** | — | Icon library |
| **Recharts** | 3.x | Charting for admin dashboard |
| **React Hook Form** | 7.x | Form state management & validation |

---

## Key Design Decisions

| Decision | Rationale |
|----------|-----------|
| **Feature-sliced organization** | Colocation of API, hooks, and components per domain keeps features self-contained and easy to navigate |
| **TanStack Query for server state** | Built-in caching, background refetching, and deduplication eliminates manual fetch/cache boilerplate |
| **Zustand for client state** | Lightweight, no boilerplate, direct localStorage sync — ideal for auth & UI state |
| **Axios with interceptors** | Centralized token injection and auto-logout on 401 across all API calls |
| **Separate API layer per feature** | API functions are pure (no React), making them testable and reusable outside hooks |
| **Route-based code splitting** | Pages are separate components, enabling natural lazy-loading boundaries |
| **Centralized route paths** | `routePaths.js` avoids scattered string literals, makes refactoring safe |
| **Auth hydration on mount** | Validates stored tokens against backend on every app load, preventing stale sessions |
| **Admin as nested layout route** | Keeps admin panel isolated with its own layout while sharing the same router instance |
| **Tailwind CSS 4 via Vite plugin** | Zero-config integration, no PostCSS setup, automatic class detection |
