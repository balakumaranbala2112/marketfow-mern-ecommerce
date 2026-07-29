# Backend Architecture — MarketFlow API

> **Stack:** Node.js · Express 5 · MongoDB / Mongoose · ES Modules

---

## Architecture Pattern

The backend follows a **Layered MVC + Service** architecture. Each incoming request flows through a clearly defined pipeline of layers, keeping concerns separated and the codebase easy to reason about.

```
Client Request
      │
      ▼
┌─────────────────────────────────────────────────────────┐
│                   MIDDLEWARE PIPELINE                    │
│  CORS → Helmet → Logger → Rate Limiter → Body Parser   │
│  → Mongo Sanitize → HPP                                │
└─────────────────────────────────────────────────────────┘
      │
      ▼
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│    ROUTES    │────▶│  VALIDATORS  │────▶│ CONTROLLERS  │
│  (Routing)   │     │  (Schemas)   │     │  (Handlers)  │
└──────────────┘     └──────────────┘     └──────┬───────┘
                                                 │
                          ┌──────────────────────┤
                          ▼                      ▼
                   ┌──────────────┐     ┌──────────────┐
                   │   SERVICES   │     │    MODELS     │
                   │  (Business)  │     │  (Mongoose)   │
                   └──────────────┘     └──────────────┘
                                                 │
                                                 ▼
                                        ┌──────────────┐
                                        │   MongoDB     │
                                        └──────────────┘
```

---

## Directory Structure

```
server/
├── server.js                    # Entry point — boots DB, starts HTTP server
├── package.json
├── .env / .env.example
├── scripts/                     # CLI utilities (seed, test, admin setup)
│   ├── seed.js
│   ├── seedAdmin.js
│   ├── testEmail.js
│   ├── testPasswordHash.js
│   ├── checkModels.js
│   ├── listIndexes.js
│   └── generateWebhookSignature.js
│
└── src/
    ├── app.js                   # Express app setup & middleware pipeline
    │
    ├── config/                  # Environment & third-party configuration
    │   ├── env.js               # Centralized env variable loader
    │   ├── db.js                # MongoDB connection
    │   ├── logger.js            # Winston logger setup
    │   ├── cloudinary.js        # Cloudinary SDK config
    │   ├── email.js             # Nodemailer transporter config
    │   └── razorpay.js          # Razorpay SDK config
    │
    ├── constants/               # Application-wide constants
    │   ├── roles.js             # User role enums
    │   └── statusCodes.js       # HTTP status code map
    │
    ├── models/                  # Mongoose schemas & models
    │   ├── user.model.js
    │   ├── product.model.js
    │   ├── category.model.js
    │   ├── cart.model.js
    │   ├── order.model.js
    │   ├── review.model.js
    │   ├── coupon.model.js
    │   ├── wishlist.model.js
    │   └── webhookEvent.model.js
    │
    ├── routes/                  # Express route definitions
    │   ├── index.routes.js      # Health / root
    │   ├── auth.routes.js
    │   ├── user.routes.js
    │   ├── product.routes.js
    │   ├── category.routes.js
    │   ├── cart.routes.js
    │   ├── order.routes.js
    │   ├── review.routes.js
    │   ├── wishlist.routes.js
    │   ├── coupon.routes.js
    │   ├── dashboard.routes.js
    │   ├── payment.routes.js
    │   ├── paymentWebhook.routes.js
    │   └── docs.routes.js       # Swagger UI
    │
    ├── controllers/             # Request handlers (thin layer)
    │   ├── auth.controller.js
    │   ├── user.controller.js
    │   ├── product.controller.js
    │   ├── category.controller.js
    │   ├── cart.controller.js
    │   ├── order.controller.js
    │   ├── review.controller.js
    │   ├── wishlist.controller.js
    │   ├── coupon.controller.js
    │   ├── dashboard.controller.js
    │   ├── payment.controller.js
    │   ├── paymentWebhook.controller.js
    │   └── health.controller.js
    │
    ├── services/                # Business logic & external integrations
    │   ├── cloudinary.service.js # Image upload/delete via Cloudinary
    │   └── email.service.js      # Transactional emails via Nodemailer
    │
    ├── middlewares/              # Express middleware functions
    │   ├── auth.middleware.js          # JWT protect & role authorization
    │   ├── security.middleware.js      # CORS, Helmet, Rate Limit, HPP, Sanitize
    │   ├── requestLogger.middleware.js # Morgan HTTP request logger
    │   ├── upload.middleware.js        # Multer file upload
    │   ├── validateRequest.js          # Body validation runner
    │   ├── validateQueryRequest.js     # Query param validation runner
    │   ├── errorHandler.js            # Global error handler
    │   └── notFound.js                # 404 fallback handler
    │
    ├── validators/              # Request validation schemas
    │   ├── auth.validator.js
    │   ├── user.validator.js
    │   ├── product.validator.js
    │   ├── productQuery.validator.js
    │   ├── category.validator.js
    │   ├── categoryQuery.validator.js
    │   ├── cart.validator.js
    │   ├── order.validator.js
    │   ├── review.validator.js
    │   ├── coupon.validator.js
    │   ├── payment.validator.js
    │   ├── upload.validator.js
    │   └── wishlist.validator.js
    │
    ├── utils/                   # Shared utility functions
    │   ├── AppError.js          # Custom error class
    │   ├── asyncHandler.js      # Async/await error wrapper
    │   ├── sendResponse.js      # Standardized JSON response
    │   ├── ApiFeatures.js       # Query filtering, sorting, pagination
    │   ├── token.js             # JWT sign & verify helpers
    │   ├── sanitizeUser.js      # Strip sensitive user fields
    │   ├── calculateCartTotals.js
    │   ├── createSlug.js
    │   ├── emailTemplates.js    # HTML email templates
    │   ├── errorHelpers.js      # Mongoose error formatters
    │   ├── razorpay.js          # Razorpay signature verification
    │   ├── removeUndefinedFields.js
    │   └── validators.js        # Shared validation helpers
    │
    └── docs/                    # Swagger / OpenAPI documentation
        ├── swagger.js
        ├── swagger.paths.js
        └── swagger.components.js
```

---

## Layer Responsibilities

### 1. Entry Point (`server.js`)

- Boots the MongoDB connection via `connectDB()`
- Starts the Express HTTP server
- Registers global process handlers: `uncaughtException`, `unhandledRejection`, `SIGTERM`
- Provides **graceful shutdown** support

### 2. Application Setup (`src/app.js`)

Assembles the Express pipeline in a strict order:

| Order | Middleware | Purpose |
|-------|-----------|---------|
| 1 | `cors()` | Cross-origin request control |
| 2 | `helmet()` | HTTP security headers |
| 3 | `requestLogger()` | Morgan-based HTTP logging |
| 4 | `express.raw()` | Raw body for webhook signature verification |
| 5 | `express.json()` | JSON body parser (10kb limit) |
| 6 | `express.urlencoded()` | URL-encoded body parser |
| 7 | `mongoSanitize()` | NoSQL injection prevention |
| 8 | `hpp()` | HTTP parameter pollution protection |
| 9 | `globalRateLimiter()` | API-wide rate limiting |
| 10 | `express.static()` | Serve client production build (if exists) |
| 11 | **Route handlers** | Business route registration |
| 12 | **SPA fallback** | Serve `index.html` for client-side routing |
| 13 | `notFound` | 404 catch-all |
| 14 | `errorHandler` | Centralized error response |

### 3. Routes Layer

- Maps HTTP methods + URL paths to controller functions
- Composes middleware chains: `protect → authorizeRoles → validate → controller`
- API is versioned under `/api/v1/`
- Swagger docs served at `/api-docs`

### 4. Validators Layer

- Schema-based request validation
- Runs **before** controllers via `validateRequest` and `validateQueryRequest` middleware
- Validates body, params, and query separately
- Returns structured error messages on failure

### 5. Controllers Layer (Thin Controllers)

- Extract validated data from `req`
- Delegate to Models or Services for business logic
- Return standardized responses via `sendResponse()`
- Wrapped in `asyncHandler()` for automatic error forwarding

### 6. Services Layer

- Encapsulates **external integrations** (Cloudinary, Nodemailer)
- Keeps controllers free of third-party SDK details
- Reusable across multiple controllers

### 7. Models Layer (Mongoose)

- Define MongoDB schemas with validation, indexes, and virtuals
- Include instance methods (e.g., `changePasswordAfter`)
- Include pre/post hooks (e.g., password hashing)
- 9 models: User, Product, Category, Cart, Order, Review, Coupon, Wishlist, WebhookEvent

---

## Security Architecture

```
                    ┌─────────────────────────┐
                    │      HELMET             │  HTTP security headers
                    └────────────┬────────────┘
                                 ▼
                    ┌─────────────────────────┐
                    │      CORS               │  Origin whitelist
                    └────────────┬────────────┘
                                 ▼
                    ┌─────────────────────────┐
                    │    RATE LIMITING         │  Global + Auth-specific
                    └────────────┬────────────┘
                                 ▼
                    ┌─────────────────────────┐
                    │   MONGO SANITIZE        │  NoSQL injection prevention
                    └────────────┬────────────┘
                                 ▼
                    ┌─────────────────────────┐
                    │      HPP                │  Parameter pollution guard
                    └────────────┬────────────┘
                                 ▼
                    ┌─────────────────────────┐
                    │   INPUT VALIDATION      │  Schema-based validators
                    └────────────┬────────────┘
                                 ▼
                    ┌─────────────────────────┐
                    │   JWT AUTHENTICATION    │  Bearer token + protect()
                    └────────────┬────────────┘
                                 ▼
                    ┌─────────────────────────┐
                    │   ROLE AUTHORIZATION    │  authorizeRoles(…)
                    └─────────────────────────┘
```

| Layer | Technology | Details |
|-------|-----------|---------|
| **Authentication** | JWT (jsonwebtoken) | Stateless Bearer tokens, password-change invalidation |
| **Authorization** | Role-based (RBAC) | `admin` / `user` roles via `authorizeRoles()` |
| **Password Hashing** | bcrypt | Salt rounds configured in env |
| **Rate Limiting** | express-rate-limit | Separate limits for global API and auth endpoints |
| **Header Security** | helmet | CSP, HSTS, X-Frame-Options, etc. |
| **CORS** | cors | Whitelist-based origin validation |
| **NoSQL Injection** | express-mongo-sanitize | Strips `$` operators from body and params |
| **HTTP Parameter Pollution** | hpp | Whitelist of allowed duplicate query params |
| **Body Size Limit** | express.json | 10kb max payload |

---

## API Versioning & Documentation

- **Base Path:** `/api/v1/`
- **Documentation:** Swagger UI at `/api-docs` (swagger-jsdoc + swagger-ui-express)
- **Health Check:** Root endpoint via `health.controller.js`

---

## Error Handling Strategy

1. **`asyncHandler`** — wraps async controller functions, catches rejected promises, forwards to `next(err)`
2. **`AppError`** — custom error class with `statusCode` and `message`
3. **`errorHandler`** — global Express error middleware; formats operational vs. programming errors
4. **`errorHelpers`** — transforms Mongoose-specific errors (validation, duplicate key, cast) into user-friendly responses

---

## External Integrations

| Integration | Purpose | Config File |
|-------------|---------|-------------|
| **MongoDB** | Primary database | `config/db.js` |
| **Cloudinary** | Image upload & CDN | `config/cloudinary.js` + `services/cloudinary.service.js` |
| **Razorpay** | Payment processing | `config/razorpay.js` + `utils/razorpay.js` |
| **Nodemailer** | Transactional emails | `config/email.js` + `services/email.service.js` |
| **Winston** | Structured logging | `config/logger.js` |

---

## Key Design Decisions

| Decision | Rationale |
|----------|-----------|
| **ES Modules** (`"type": "module"`) | Modern import/export syntax, tree-shaking ready |
| **Express 5** | Native async error handling, improved routing |
| **Thin Controllers** | Controllers only orchestrate; logic lives in models/services |
| **Separate Validators** | Decoupled from controllers; reusable, testable schemas |
| **Centralized Config (`env.js`)** | Single source of truth for all environment variables |
| **Webhook raw body** | Razorpay webhook signature requires raw body before JSON parsing |
| **SPA Fallback** | Serves client build for production deployment from same server |
| **Graceful Shutdown** | `SIGTERM` and `unhandledRejection` handlers close connections cleanly |
