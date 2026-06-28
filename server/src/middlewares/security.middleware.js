import helmet from "helmet";
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";
import hpp from "hpp";

import env from "../config/env.js";
import StatusCodes from "../constants/statusCodes.js";
import AppError from "../utils/AppError.js";

function buildCorsOptions() {
  return {
    origin(origin, callback) {
      if (!origin) {
        return callback(null, true);
      }

      if (env.security.corsAllowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(
        new AppError(
          StatusCodes.FORBIDDEN,
          "This origin is not allowed by CORS",
        ),
      );
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    optionsSuccessStatus: 204,
  };
}

function helmetMiddleware() {
  return helmet({
    crossOriginResourcePolicy: {
      policy: "cross-origin",
    },
  });
}

function globalRateLimiter() {
  return rateLimit({
    windowMs: env.security.globalRateLimit.windowMs,
    max: env.security.globalRateLimit.max,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      success: false,
      message: "Too many requests. Please try again later.",
    },
  });
}

function authRateLimiter() {
  return rateLimit({
    windowMs: env.security.authRateLimit.windowMs,
    max: env.security.authRateLimit.max,
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: false,
    message: {
      success: false,
      message: "Too many authentication attempts. Please try again later.",
    },
  });
}

function mongoSanitizeMiddleware() {
  // Express 5 makes req.query a read-only getter, so the default
  // express-mongo-sanitize middleware crashes when it tries to reassign it.
  // We sanitize req.body and req.params manually instead.
  return function (req, res, next) {
    if (req.body) {
      req.body = mongoSanitize.sanitize(req.body, { replaceWith: "_" });
    }
    if (req.params) {
      req.params = mongoSanitize.sanitize(req.params, { replaceWith: "_" });
    }
    next();
  };
}

function hppMiddleware() {
  return hpp({
    whitelist: [
      "category",
      "brand",
      "minPrice",
      "maxPrice",
      "sort",
      "page",
      "limit",
      "search",
    ],
  });
}

export {
  buildCorsOptions,
  helmetMiddleware,
  globalRateLimiter,
  authRateLimiter,
  mongoSanitizeMiddleware,
  hppMiddleware,
};
