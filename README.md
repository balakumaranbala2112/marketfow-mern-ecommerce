# MarketFlow — MERN E-Commerce Platform

MarketFlow is a production-ready, full-stack MERN (MongoDB, Express, React, Node.js) e-commerce platform. It provides customers with a responsive, modern shopping experience and equips administrators with a comprehensive dashboard to manage inventories, coupon campaigns, customer orders, and analytical logs.

---

## 1. Problem Statement

Building a high-performance e-commerce platform requires solving several core challenges:
* **Catalog Browsing at Scale**: Frequent queries to search, filter, and sort products can cause database performance bottlenecks under heavy traffic if indexing is misconfigured.
* **State Synchronization**: Preventing mismatches between client-side shopping carts and real-time database inventories, especially during checkout.
* **Payment Flow Vulnerabilities**: Handling third-party payments securely requires strict backend signature verification to prevent spoofed transactions or double-spend actions.
* **Administrative Safeguards**: Protecting database integrity by restricting administrative actions (such as product creation, category adjustments, and user blocking) behind multiple security layers.
* **Immutable Order Records**: Ensuring historical purchase receipts do not dynamically change when catalog details (prices, description, image assets) are modified in the future.

MarketFlow resolves these issues by implementing a secure JWT session architecture, database-persisted carts, robust indexing, raw webhook signature verification, and immutable order detail snapshot structures.

---

## 2. Features

### Customer Experience
* **Authentication**: Email signup/login with hashed passwords (`bcrypt`) and JWT sessions. Features a secure password-reset flow utilizing time-limited hashed tokens sent via Nodemailer.
* **Interactive Catalog**: Search, pagination, sorting (price, date, stock levels, ratings), and filters (categories, brands, price ranges).
* **Persistent Shopping Cart**: Carts are saved directly to the database, ensuring they persist across different devices and sessions.
* **Coupon Integration**: Apply active discount codes (percentage or flat discount value) with checks for minimum purchase amounts, usage limits, and expiration dates.
* **Secure Checkout**: Choose between Cash on Delivery (COD) or online payment via Razorpay. Supports retry workflows for failed online orders.
* **Product Reviews & Ratings**: Submit star ratings and reviews for purchased items. The system automatically recalculates ratings averages and counts upon entry creation, updates, or deletions.
* **Personal Wishlist**: Save favorite items to a personal list with quick actions to move items to the shopping cart.
* **Profile Management**: Update profile details, upload profile pictures (Cloudinary), and change passwords.

### Administrator Control
* **Dashboard Analytics**: Real-time sales statistics, active orders counters, low-stock warnings, and historical revenue charting using Recharts.
* **Catalog Management**: Full CRUD capabilities on categories and products, including dynamic specifications lists.
* **Multi-Image Uploads**: Upload multiple product pictures to Cloudinary with drag-and-drop operations, and delete specific images by reference key.
* **Safe Category Deletion**: Safeguards prevent deleting categories that have products linked to them, avoiding orphaned listings.
* **Order & Inventory Tracking**: List and filter all orders. Update delivery statuses (e.g. from `confirmed` to `shipped` or `delivered`). Automatically restores product stock if an order is cancelled.
* **Customer Monitoring**: View registered profiles and block/unblock users. Blocked users are immediately prevented from logging in or using active API tokens.

---

## 3. Architecture Diagram

```txt
+-----------------------------------------------------------+
|                    React Frontend Client                  |
|  +-----------------------------------------------------+  |
|  |                   React Components                  |  |
|  +-----------------------------------------------------+  |
|  |    Zustand Stores     |      TanStack Query (Cache) |  |
|  +-----------------------+-----------------------------+  |
+-----------------------------------------------------------+
                              │ ▲
                              ▼ │ HTTP Rest Requests (Axios / JWT Header)
+-----------------------------------------------------------+
|                     Express API Server                    |
|  +-----------------------------------------------------+  |
|  |                  Security Middlewares               |  |
|  |     (Helmet, CORS, Rate Limiters, Mongo Sanitize)   |  |
|  +-----------------------------------------------------+  |
|  |                    App v1 Router                    |  |
|  +-----------------------------------------------------+  |
|  |         Authentication & Authorization Guards       |  |
|  +-----------------------------------------------------+  |
|  |                     Controllers                     |  |
|  |        (Auth, Product, Category, Cart, Order)       |  |
|  +-----------------------------------------------------+  |
+-----------------------------------------------------------+
        │ ▲                                         │
        │ │ Mongoose Queries                        ▼ External Integrations
+───────▼─┴───────────+                     +───────────────────────+
|   MongoDB Database  |                     |   External Services   |
|   (Indexed Schemas) |                     |  - Cloudinary Storage |
+─────────────────────+                     |  - Nodemailer SMTP    |
                                            |  - Razorpay SDK       |
                                            +───────────────────────+
```

---

## 4. Tech Stack

### Frontend
* **Core Framework**: React 19 + Vite 8 (with ES Modules style imports).
* **Styling**: Tailwind CSS v4.
* **Routing**: React Router v8 (layouts, nested routing, and protected path guards).
* **State Management**:
  * **Zustand v5**: Lightweight client state (auth credentials, persistent local storage, global toast alerts).
  * **TanStack Query (React Query) v5**: Server state management, data fetching, automated background revalidation, and API response caching.
* **Forms & Validation**: React Hook Form v7.
* **Data Visualization**: Recharts v3.
* **Icons**: Lucide React.

### Backend
* **Runtime**: Node.js.
* **Framework**: Express.js (v5) (utilizing ES Module import/export syntax).
* **Database**: MongoDB & Mongoose ODM v9.
* **Authentication**: JWT (JSON Web Tokens) & Password encryption via Bcrypt.
* **Storage & Uploads**: Multer middleware paired with the Cloudinary Node SDK.
* **Mailing**: Nodemailer (configured with custom HTML email templates).
* **Payment Gateways**: Razorpay Node SDK.
* **APIs**: Swagger UI Express & Swagger JSDoc for OpenAPI specifications.
* **Logger**: Winston (file logging in production, console in development) + Morgan (HTTP request logging).

---

## 5. Folder Structure

```txt
marketflow-mern-ecommerce/
├── client/                     # Frontend client workspace
│   ├── src/
│   │   ├── app/                # Global contexts, e.g. TanStack Query Providers
│   │   ├── assets/             # Shared style sheets, fonts, default logos
│   │   ├── components/         # Reusable UI elements (FormInput, StarRating, Pagination, Badges)
│   │   ├── data/               # Static dataset configurations
│   │   ├── features/           # Feature modular architecture
│   │   │   ├── auth/           # API endpoints, mutation hooks, and logic for authentication
│   │   │   ├── products/       # Products data queries, review handlers, filtering states
│   │   │   ├── cart/           # Cart modifications, checkout forms, coupon triggers
│   │   │   └── admin/          # Admin CRUD features and dashboard charting UI
│   │   ├── hooks/              # Global custom hooks
│   │   ├── layouts/            # Page shell layouts (PublicLayout, AdminLayout)
│   │   ├── lib/                # Configuration modules, e.g. Axios Instance Interceptors
│   │   ├── pages/              # Routed view containers (Home, ProductDetails, Wishlist)
│   │   ├── routes/             # Path definitions, routing mappings, and ProtectedRoutes
│   │   ├── stores/             # Zustand global stores (authStore, toastStore)
│   │   └── index.css           # Tailwind CSS directives
│   ├── package.json            # React dependencies configuration
│   └── vite.config.js          # Vite compilation settings
├── server/                     # Backend API server workspace
│   ├── src/
│   │   ├── config/             # Environment variables mapping (env.js) and DB configurations
│   │   ├── constants/          # Application enums (User Roles, Status Codes)
│   │   ├── controllers/        # Route logic orchestrators (Auth, Cart, Order, Product)
│   │   ├── docs/               # OpenAPI Swagger schema declarations
│   │   ├── middlewares/        # Express handlers (Auth verify, Rate Limiting, Error handlings)
│   │   ├── models/             # Mongoose schemas (User, Product, Order, Category, Cart)
│   │   ├── routes/             # API sub-routers (v1 endpoints mapped inside index.routes.js)
│   │   ├── services/           # External API integrations (Cloudinary, Nodemailer)
│   │   ├── utils/              # Helper utilities (ApiFeatures, AppError, Response builder)
│   │   └── validators/         # Input request validation schema constraints
│   ├── scripts/                # Database seeding, index logging, and diagnostic tools
│   ├── server.js               # Express app listener bootstrap
│   ├── package.json            # Backend dependencies configuration
│   └── .env.example            # Environment variables placeholder definitions
├── docs/                       # Project planning guidelines
└── README.md                   # Current documentation file
```

---

## 6. API Documentation

The server automatically generates interactive OpenAPI API specifications.
* **Swagger Docs URL**: `http://localhost:5000/api-docs` (available in development mode)
* **OpenAPI Raw Spec**: `http://localhost:5000/api-docs/openapi.json`

### Endpoint Overview

#### Authentication (`/api/v1/auth`)
* `POST /register` - Register a customer account.
* `POST /login` - Sign in and return a JWT access token.
* `GET /me` - Fetch details of the currently authenticated user (protected).
* `POST /forgot-password` - Request a password reset link email.
* `POST /reset-password/:resetToken` - Reset password using the token sent via email.

#### User Management & Profile (`/api/v1/users`)
* `GET /profile` - Retrieve own profile (protected).
* `PUT /profile` - Update own profile (name, phone, avatar) (protected).
* `POST /avatar` - Upload a profile avatar image (protected).
* `DELETE /avatar` - Remove current profile avatar image (protected).
* `GET /admin` - List all system users (admin only).
* `GET /admin/:userId` - View details of a specific user account (admin only).
* `PUT /admin/:userId/block` - Block a customer account (admin only).
* `PUT /admin/:userId/unblock` - Unblock a customer account (admin only).

#### Category Management (`/api/v1/categories`)
* `GET /` - List all active categories (public).
* `GET /:categoryId` - View specific category details (public).
* `POST /` - Create a category (admin only).
* `PUT /:categoryId` - Edit an existing category (admin only).
* `DELETE /:categoryId` - Delete an unused category (admin only).

#### Product Catalog (`/api/v1/products`)
* `GET /` - Query products with pagination, search, sort, and filters (public).
* `GET /:productId` - Fetch detailed information about a single product (public).
* `POST /` - Create a product catalog entry (admin only).
* `PUT /:productId` - Update product details (admin only).
* `DELETE /:productId` - Delete a product entry (admin only).
* `POST /:productId/images` - Upload multiple product images (admin only).
* `DELETE /:productId/images` - Delete a specific product image (admin only).

#### Shopping Cart (`/api/v1/cart`)
* `GET /` - Fetch current user's shopping cart items (protected).
* `POST /items` - Add a product to the cart (protected).
* `PUT /items/:cartItemId` - Modify quantity of an item in the cart (protected).
* `DELETE /items/:cartItemId` - Remove an item from the cart (protected).
* `DELETE /` - Clear the user's cart (protected).

#### Wishlist (`/api/v1/wishlist`)
* `GET /` - Fetch user's wishlist (protected).
* `POST /items` - Add a product reference to the wishlist (protected).
* `DELETE /items/:productId` - Remove a product reference from the wishlist (protected).

#### Order Handling (`/api/v1/orders`)
* `POST /` - Place a new order from current cart items (protected).
* `GET /my-orders` - List the user's order history (protected).
* `GET /:orderId` - View details of a single user order (protected).
* `GET /admin` - List all customer orders (admin only).
* `GET /admin/:orderId` - Retrieve details of any customer order (admin only).
* `PUT /admin/:orderId/status` - Update an order's fulfillment status (admin only).

#### Coupon Management (`/api/v1/coupons`)
* `POST /admin` - Create a discount coupon (admin only).
* `GET /admin` - List all coupons in the system (admin only).
* `POST /apply` - Apply a coupon code to the shopping cart (protected).
* `DELETE /remove` - Remove the applied coupon from the cart (protected).

#### Online Payments (`/api/v1/payments`)
* `POST /razorpay/create-order` - Initialize a Razorpay checkout intent (protected).
* `POST /razorpay/verify` - Verify Razorpay payment signatures (protected).
* `POST /razorpay/failure` - Record details of a failed payment attempt (protected).
* `POST /razorpay/retry/:orderId` - Re-generate a Razorpay order ID for retry checkout (protected).
* `POST /razorpay/webhook` - Asynchronously capture Razorpay events (public).
* `PUT /admin/cleanup-pending-online-orders` - Expire old pending orders and restore inventory stock (admin only).

---

## 7. Database Schema

MarketFlow uses MongoDB via Mongoose. The database consists of 8 primary collections:

```
┌──────────────┐       ┌────────────────┐       ┌──────────────┐
│    users     │ ◄───┐ │     carts      │ ┌───► │  categories  │
└──────────────┘     │ └────────────────┘ │     └──────────────┘
       ▲             │         │          │            ▲
       │             │         ▼          │            │
       │             └──── ┌────────────┐ ├────────────┘
       │                   │  products  │ │
       │             ┌───► └────────────┘ │
       │             │         ▲          │
       │             │         │          │
┌──────────────┐     │ ┌────────────────┐ │     ┌──────────────┐
│   reviews    │ ────┘ │    orders      │─┘     │   coupons    │
└──────────────┘       └────────────────┘       └──────────────┘
```

### Collection Definitions

1. **`users`**: Manages customer profiles, access flags, and password security timestamps.
2. **`categories`**: Stores category metadata, slug keys, and banner image URLs.
3. **`products`**: Product specifications, catalog stock boundaries, SKU keys, average ratings, and active statuses.
4. **`carts`**: Stores user cart items (copies of product price/assets) and applied coupon structures.
5. **`orders`**: Immutable snapshots of purchase details, tax details, shipping address, and payment statuses.
6. **`reviews`**: Product ratings (1 to 5 stars) and comment approvals. Linked to both users and products.
7. **`coupons`**: Discount criteria, usage counts, limits, and validation parameters.
8. **`webhookevents`**: Logs Razorpay webhook events to prevent duplicate event execution.

### Design Decisions
* **Embedded Items in Carts & Orders**: Cart items are embedded directly within the Cart schema to minimize joins. Similarly, order items are stored as immutable snapshots, ensuring historical order totals are unaffected if product schemas are updated later.
* **Category References**: Products reference their Parent Category via `Schema.Types.ObjectId`, allowing categories to remain independent and easily manageable.
* **Review Constraint**: A unique compound index `{ user: 1, product: 1 }` ensures a user can submit only one review per product.

---

## 8. Indexing Decisions

To handle high query volumes efficiently, the database schema utilizes optimized single and compound indexes:

### Product Collection
* `{ isActive: 1, createdAt: -1 }`: Optimizes product catalog queries that filter by active status and sort by newest.
* `{ category: 1, isActive: 1, createdAt: -1 }`: Speeds up category-specific browsing pages.
* `{ category: 1, isActive: 1, price: 1 }`: Optimizes product lists filtered by category and sorted by price.
* `{ isFeatured: 1, isActive: 1, createdAt: -1 }`: Used for homepage featured carousels.
* `{ brand: 1, isActive: 1, createdAt: -1 }`: Speeds up queries on brand-specific landing pages.
* `{ ratingsAverage: -1, isActive: 1 }`: Optimizes listings sorted by popularity or rating.

### Review Collection
* `{ user: 1, product: 1 }` (Unique): Enforces the business rule that a user can only review a product once.
* `{ product: 1, createdAt: -1 }`: Speeds up loading the reviews section on product details pages.

### Order Collection
* `{ user: 1, createdAt: -1 }`: Optimizes retrieving a user's personal order history.
* `{ orderStatus: 1, createdAt: -1 }`: Speeds up admin dashboard order fulfillment queues.
* `{ paymentStatus: 1, createdAt: -1 }`: Assists in locating payment failures or cleaning up unpaid orders.

### Webhook Event Collection
* `{ provider: 1, eventId: 1 }` (Unique): Critical for idempotency, ensuring the backend never processes the same payment webhook event twice.
* `{ providerOrderId: 1, createdAt: -1 }`: Speeds up payment logging lookups.

---

## 9. Caching Strategy

MarketFlow employs a layered approach to data retrieval:

* **Client Cache (Zustand & TanStack Query)**: TanStack Query manages client-side API response caching. Active queries (such as product details or user sessions) are cached in-memory and revalidated in the background. Explicit cache invalidations occur upon state changes (e.g. `invalidateQueries(['cart'])` after an add-to-cart action).
* **Database Query Performance**: Heavily queried parameters are indexed directly in MongoDB, minimizing disk reads and memory usage.
* **Future Caching Layer**: Future iterations plan to integrate **Redis** to cache database responses for static catalogs and dashboard metrics.

---

## 10. Security Decisions

MarketFlow incorporates security measures throughout the application layer:

* **Password Protection**: Passwords are hashed using `bcrypt` with a work factor of 12 rounds. Plaintext passwords are never stored in the database.
* **Authentication Controls**: JWT access tokens are signed using a secure algorithm and verified via Express middleware.
* **Session Expiry**: The `protect` middleware compares the token issue date (`iat`) with the user's `passwordChangedAt` timestamp. If the password was changed after the token was issued, the token is invalidated, forcing the user to log in again.
* **NoSQL Injection Defense**: The `express-mongo-sanitize` middleware blocks incoming query parameters containing keys with `$` or `.` operators.
* **HTTP Hardening**: Helmet middleware sets secure HTTP headers to mitigate cross-site scripting (XSS), clickjacking, and mime-type sniffing.
* **Request Throttling**: Global and auth-route-specific rate limiting (`express-rate-limit`) prevents brute-force attempts and denial-of-service (DDoS) traffic.
* **CORS Controls**: Server CORS options are restricted to allowed hostnames configured via backend environment variables.
* **Payment Validation**: Razorpay webhook validation requires matching signatures calculated using the raw body payload and the webhook secret, preventing webhook spoofing attacks.

---

## 11. AI Architecture

Advanced features are designed to integrate with the Google Gemini API (or equivalent LLMs) using the following architecture:

```
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│  React UI Page  │ ◄───► │  Express Route  │ ◄───► │  Gemini API SDK │
└─────────────────┘       └─────────────────┘       └─────────────────┘
                                   │
                                   ▼
                          ┌─────────────────┐
                          │  MongoDB Cache  │
                          └─────────────────┘
```

1. **AI Product Description Generator**: Admins enter basic specifications in the dashboard. The backend constructs a prompt containing the product name and key attributes, calls the Gemini API, and returns a structured product description.
2. **AI Search Suggestions**: Provides search suggestions based on semantic search queries and intent parsing.
3. **AI Product Recommendation**: Suggests related products by parsing category popularity and user wishlist data.
4. **AI Review Sentiment Summary**: Aggregates customer review comments for a product, generating a summary of pros and cons using sentiment analysis.

---

## 12. Testing Strategy

* **Diagnostic Verification Scripts**: The application includes diagnostic scripts in the `server/scripts/` folder:
  * `checkModels.js`: Validates Mongoose schema constraints and database connections.
  * `listIndexes.js`: Queries and lists active collection indexes.
  * `testPasswordHash.js`: Benchmarks password encryption performance and compares hash algorithms.
  * `testEmail.js`: Tests Nodemailer SMTP configurations by sending a test email.
* **Manual Verification**: API endpoints are tested using Swagger UI, Postman collections, and manual database state inspections.
* **Build Verification**: Compiles frontend assets via `npm run build` to verify bundles and dependencies.

---

## 13. Deployment Steps

### Environment Configuration
Create a `.env` file in the server directory based on `.env.example`:
```env
PORT=5000
NODE_ENV=production
CLIENT_URL=https://yourdomain.com
MONGO_URI=mongodb+srv://...

JWT_ACCESS_SECRET=your_jwt_secret
JWT_ACCESS_EXPIRES_IN=1d

RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

EMAIL_HOST=smtp.mailgun.org
EMAIL_PORT=587
EMAIL_USER=your_smtp_username
EMAIL_PASS=your_smtp_password
EMAIL_ENABLED=true
```

### Steps to Deploy

#### 1. Compile the React Frontend
Navigate to the client directory, install dependencies, and build the production bundle:
```bash
cd client
npm install
npm run build
```
This compiles assets into the `client/dist` directory.

#### 2. Start the Express Backend
Install server dependencies. In production, the Express app is configured to serve the static files from `client/dist` directly:
```bash
cd ../server
npm install --omit=dev
npm start
```

#### 3. Production Hosting Options
* **PaaS Providers (Render, Railway, Fly.io)**: Deploy the root folder, using `npm run build` in the client directory as the build command, and `node server/src/server.js` (or `npm run start` in the server directory) as the start command.
* **VPS/Dedicated Servers (AWS EC2, DigitalOcean)**: Set up a reverse proxy using Nginx to route traffic to port `5000`. Use **PM2** to manage the Node.js process:
  ```bash
  pm2 start server/server.js --name "marketflow-app"
  ```

---

## 14. Screenshots

*Screenshots can be stored in the `/docs/screenshots/` folder.*

1. **User Home & Catalog Page**: Includes product search, pagination, and filter parameters.
2. **Product Details & Review Form**: Displays specifications, stock levels, and interactive rating stars.
3. **Shopping Cart & Checkout**: Interactive list displaying coupon applications and price breakdowns.
4. **Admin KPI Dashboard**: Displaying charts, total sales metrics, and low-stock warnings.
5. **Admin Inventory CRUD Panel**: Interface for category creation, product updates, and multi-file image uploads.

---

## 15. Future Improvements

* **Redis Caching**: Cache database responses for static catalogs and category queries to improve performance under load.
* **Automated Testing Suite**: Integrate Jest, Supertest, and Cypress for unit, integration, and end-to-end testing.
* **Account Verification**: Add an email verification step during user registration before allowing access to checkout flows.
* **Automated Cleanup Jobs**: Schedule cron jobs (e.g. using `node-cron`) to run database cleanups, prune expired coupon logs, and remove stale shopping carts.
* **Advanced Refund Workflow**: Automate payment refunds through the Razorpay SDK when orders are cancelled by administrators.