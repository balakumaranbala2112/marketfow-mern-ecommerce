# MarketFlow MERN E-Commerce – Frontend Manual Build Guide

This step-by-step guide explains how to build the entire MarketFlow frontend from scratch to connect with the backend API. It details the precise order of operations, architectural decisions, and integration points.

---

## Phase 1: Initialization & Tooling

### Step 1.1: Initialize the Project
Create a fresh React application using Vite:
```bash
npm create vite@latest client -- --template react
cd client
npm install
```

### Step 1.2: Install Core Dependencies
Install the required routing, state management, form handling, and utility libraries:
```bash
npm install react-router@8 @tanstack/react-query@5 zustand@5 axios lucide-react react-hook-form recharts
```

### Step 1.3: Configure Tailwind CSS v4
1. Install Tailwind CSS and its Vite plugin:
   ```bash
   npm install tailwindcss @tailwindcss/vite
   ```
2. Update `vite.config.js` to register the Tailwind CSS plugin:
   ```javascript
   import { defineConfig } from 'vite'
   import react from '@vitejs/plugin-react'
   import tailwindcss from '@tailwindcss/vite'

   export default defineConfig({
     plugins: [react(), tailwindcss()],
   })
   ```
3. Import Tailwind in your entry CSS file (`src/index.css`):
   ```css
   @import "tailwindcss";
   ```

---

## Phase 2: Project Structure & Routing Setup

### Step 2.1: Establish Directory Layout
Organize the `src` folder using a feature-based architecture:
```txt
src/
  app/          # Global providers (QueryClient, etc.)
  components/   # Reusable UI components (buttons, loaders, inputs)
  features/     # Feature-specific logic (auth, cart, products, orders)
    */api.js      # API requests
    */hooks/      # React Query hooks
  layouts/      # Shared page layouts (PublicLayout, AdminLayout)
  pages/        # Routed page components
  routes/       # Router configuration & route guards
  stores/       # Zustand global state stores
  lib/          # Client configurations (axios, helper functions)
```

### Step 2.2: Define Route Paths
Create `src/routes/routePaths.js` to centralize all application URLs:
```javascript
const routePaths = {
  home: "/",
  products: "/products",
  productDetails: "/products/:productId",
  login: "/login",
  register: "/register",
  forgotPassword: "/forgot-password",
  resetPassword: "/reset-password/:resetToken",
  cart: "/cart",
  checkout: "/checkout",
  profile: "/profile",
  orders: "/orders",
  orderDetail: "/orders/:orderId",
  wishlist: "/wishlist",
  adminDashboard: "/admin/dashboard",
  adminProducts: "/admin/products",
  adminProductCreate: "/admin/products/new",
  adminProductEdit: "/admin/products/:productId/edit",
  adminCategories: "/admin/categories",
  adminOrders: "/admin/orders",
  adminOrderDetail: "/admin/orders/:orderId",
  adminUsers: "/admin/users",
  adminCoupons: "/admin/coupons",
  notFound: "*",
};
export default routePaths;
```

### Step 2.3: Create Route Guard (`ProtectedRoute`)
Create `src/routes/ProtectedRoute.jsx` to restrict access to authenticated users and authorized roles:
* Check for the presence of `accessToken` and `user` in your auth store.
* If missing, redirect to `/login` while saving the current path in the router location state.
* If `allowedRoles` is specified, verify that `user.role` is included; otherwise, redirect to the home page.

---

## Phase 3: State Management & API Client

### Step 3.1: Configure Axios Instance
Create `src/lib/axiosInstance.js` to handle API communication:
1. Set the `baseURL` pointing to your backend API (e.g., `http://localhost:5000/api/v1`).
2. Add a **Request Interceptor** that automatically attaches the JWT token from local storage:
   ```javascript
   config.headers.Authorization = `Bearer ${token}`;
   ```
3. Add a **Response Interceptor** that intercepts `401 Unauthorized` responses to clear local session storage if a token expires.

### Step 3.2: Create Zustand Stores
1. **`authStore.js`**:
   * Manage `user`, `accessToken`, and `isHydrated` states.
   * Expose `setAuth({ user, accessToken })` (persists to `localStorage`) and `clearAuth()` (clears `localStorage`).
2. **`toastStore.js`**:
   * Maintain an array of active notifications.
   * Expose `addToast({ type, message, duration })` and `removeToast(id)` to show alerts globally.

---

## Phase 4: Shared UI Components

Before building pages, create reusable components in `src/components/common/`:
1. **`Toast.jsx`**: Floating alerts displaying status messages from `toastStore`.
2. **`FormInput.jsx` / `FormTextarea.jsx`**: Inputs styled with consistent borders, focus rings, and red validation error labels.
3. **`StarRating.jsx`**: Renders yellow stars based on rating numbers; supports click handlers when marked `interactive`.
4. **`Pagination.jsx`**: Numeric page buttons with back/forward controls.
5. **`Badge.jsx`**: Color-coded badges for status tags (`delivered` = green, `pending` = yellow, `cancelled` = red).
6. **`ConfirmDialog.jsx`**: A modal warning dialog for destructive actions like clearing the cart or deleting items.

---

## Phase 5: Authentication Flow

### Step 5.1: API & Hooks Setup
Create `src/features/auth/authApi.js` and custom hooks in `src/features/auth/hooks/useAuth.js` utilizing React Query's `useMutation`:
* `useLogin` → POST `/auth/login`
* `useRegister` → POST `/auth/register`
* `useForgotPassword` → POST `/auth/forgot-password`
* `useResetPassword` → POST `/auth/reset-password/:resetToken`

### Step 5.2: Create Auth Pages
1. **`LoginPage.jsx`**: Use `react-hook-form` to capture email and password. On success, call `setAuth` and redirect to the saved location.
2. **`RegisterPage.jsx`**: Capture name, email, and password. Log the user in automatically on successful registration.
3. **`ForgotPasswordPage.jsx`** & **`ResetPasswordPage.jsx`**: Complete the recovery flows.

---

## Phase 6: Customer Shopping Experience

### Step 6.1: Product Catalog & Filtering
1. Create `src/features/products/productApi.js` and `useProducts(params)` hook.
2. **`ProductsPage.jsx`**:
   * Bind URL search parameters (e.g., `?search=...&category=...&sort=...`) to the `useProducts` query key.
   * Render a sidebar with category options, price range inputs, and a sorting dropdown.
   * Render the product grid with pagination.

### Step 6.2: Product Details & Reviews
1. Create `useProduct(id)` and `useProductReviews(id)` hooks.
2. **`ProductDetailsPage.jsx`**:
   * Show image gallery, description, stock status, and specifications.
   * Implement quantity selectors bounded by `product.stock`.
   * Render the review list and display a review form if the user is logged in.

### Step 6.3: Cart & Checkout
1. Create `src/features/cart/cartApi.js` and hooks: `useCart`, `useAddToCart`, `useUpdateCartItem`, `useRemoveCartItem`, `useApplyCoupon`.
2. **`CartPage.jsx`**: List items with quantity increments, trash buttons, coupon inputs, and total cost summaries.
3. **`CheckoutPage.jsx`**: A shipping address form. On submit, call `useCreateOrder` and redirect to the order details page.

### Step 6.4: Customer Account Dashboard
1. **`OrdersPage.jsx`**: Display a list of all user orders fetched via `useMyOrders` showing date, price, and status badges.
2. **`OrderDetailPage.jsx`**: Display a single order summary, itemized receipt, shipping address, and payment method details.
3. **`WishlistPage.jsx`**: Display items saved by the user with a quick "Move to Cart" button.
4. **`ProfilePage.jsx`**: Edit personal details (name, phone), upload avatars using `multipart/form-data`, and change passwords.

---

## Phase 7: Admin Console

### Step 7.1: Setup Admin Layout
* Create `src/layouts/AdminLayout.jsx` featuring a persistent dark sidebar listing admin routes: *Dashboard, Products, Categories, Orders, Users, Coupons*.
* Wrap the layout in `<ProtectedRoute allowedRoles={["admin"]}>` in your router.

### Step 7.2: Build Admin Dashboards
1. **`AdminDashboardPage.jsx`**:
   * Fetch KPI statistics using `useDashboardSummary`.
   * Render cards for Revenue, Orders, Products, and Users.
   * Use `recharts` (`AreaChart` or `BarChart`) to plot sales data.
   * Show low-stock warnings and a table of recent order activity.

### Step 7.3: Manage the Product & Category Catalog
1. **`AdminProductsPage.jsx`**: A tabular view of all products with search, pagination, and edit/delete actions.
2. **`AdminProductFormPage.jsx`**: A form using `useFieldArray` to dynamically add/remove product images and specifications.
3. **`AdminCategoriesPage.jsx`**: List all categories alongside a simple form to create or edit category names, descriptions, and banner images.

### Step 7.4: Operations & Marketing
1. **`AdminOrdersPage.jsx` & `AdminOrderDetailPage.jsx`**: Display all customer orders. Include a status dropdown enabling admins to update order states (e.g. transition from `confirmed` to `shipped`).
2. **`AdminUsersPage.jsx`**: List registered users. Render "Block" or "Activate" buttons that trigger user status mutations.
3. **`AdminCouponsPage.jsx`**: List active campaigns next to a coupon creation form (setting discount values, expiry dates, and usage limits).

---

## Phase 8: App Bootstrap & Launch

### Step 8.1: Session Hydration
In `src/App.jsx`, run a startup effect:
* Check if `accessToken` exists in local storage.
* If present, fire a `/users/me` request to verify token validity.
* Set `isHydrated` to true once the check completes, ensuring page guards do not trigger premature redirects.

### Step 8.2: Mount Routing
In `src/main.jsx`, wrap your application:
```javascript
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AppProviders>
        <App />
      </AppProviders>
    </BrowserRouter>
  </StrictMode>,
);
```

### Step 8.3: Verification
Verify compilation and bundle size:
```bash
npm run build
```
This ensures all asset references, TypeScript-like configurations, and bundler plugins resolve correctly before deployment.
