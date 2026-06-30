import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs";

import env from "./config/env.js";

import indexRoutes from "./routes/index.routes.js";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import productRoutes from "./routes/product.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import orderRoutes from "./routes/order.routes.js";
import reviewRoutes from "./routes/review.routes.js";
import wishlistRoutes from "./routes/wishlist.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import couponRoutes from "./routes/coupon.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
import paymentWebhookRoutes from "./routes/paymentWebhook.routes.js";
import requestLogger from "./middlewares/requestLogger.middleware.js";
import docsRoutes from "./routes/docs.routes.js";

import notFound from "./middlewares/notFound.js";
import errorHandler from "./middlewares/errorHandler.js";

import {
  authRateLimiter,
  buildCorsOptions,
  globalRateLimiter,
  helmetMiddleware,
  hppMiddleware,
  mongoSanitizeMiddleware,
} from "./middlewares/security.middleware.js";

const app = express();
const clientBuildPath = path.join(process.cwd(), "../client/dist");

if (env.isProduction) {
  app.set("trust proxy", 1);
}

app.use(cors(buildCorsOptions()));

app.use(helmetMiddleware());

app.use(requestLogger());

app.use(
  "/api/v1/payments/razorpay/webhook",
  express.raw({ type: "application/json" }),
  paymentWebhookRoutes,
);

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

app.use(mongoSanitizeMiddleware());
app.use(hppMiddleware());

app.use("/api", globalRateLimiter());

if (fs.existsSync(clientBuildPath)) {
  app.use(express.static(clientBuildPath));
}

app.use("/", indexRoutes);

app.use("/api/v1/auth", authRateLimiter(), authRoutes);

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/categories", categoryRoutes);
app.use("/api/v1/products/:productId/reviews", reviewRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/cart", cartRoutes);
app.use("/api/v1/orders", orderRoutes);
app.use("/api/v1/wishlist", wishlistRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);
app.use("/api/v1/coupons", couponRoutes);
app.use("/api/v1/payments", paymentRoutes);
app.use("/api-docs", docsRoutes);

if (fs.existsSync(clientBuildPath)) {
  app.use((req, res, next) => {
    if (req.method !== "GET") {
      return next();
    }
    if (req.originalUrl.startsWith("/api") || req.originalUrl.startsWith("/api-docs")) {
      return next();
    }
    res.sendFile(path.join(clientBuildPath, "index.html"));
  });
}

app.use(notFound);

app.use(errorHandler);

export default app;
