import dotenv from "dotenv";

dotenv.config();

function parseAllowedOrigins(value) {
  if (!value) {
    return [];
  }

  return value
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
}

const requiredEnvVars = ["MONGO_URI"];

function checkRequiredEnvVars() {
  const missingEnvVars = requiredEnvVars.filter((key) => !process.env[key]);

  if (missingEnvVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingEnvVars.join(", ")}`,
    );
  }
}

checkRequiredEnvVars();

const allowedNodeEnvs = ["development", "test", "production"];

const nodeEnv = process.env.NODE_ENV || "development";

if (!allowedNodeEnvs.includes(nodeEnv)) {
  throw new Error(
    `Invalid NODE_ENV. Allowed values: ${allowedNodeEnvs.join(", ")}`,
  );
}

const bcryptSaltRoundsRaw = process.env.BCRYPT_SALT_ROUNDS;

const bcryptSaltRounds =
  bcryptSaltRoundsRaw === undefined ? 12 : Number(bcryptSaltRoundsRaw);

if (!Number.isInteger(bcryptSaltRounds) || bcryptSaltRounds < 10) {
  throw new Error("BCRYPT_SALT_ROUNDS must be an integer of at least 10");
}

const jwtAccessSecret = process.env.JWT_ACCESS_SECRET;

if (!jwtAccessSecret || jwtAccessSecret.length < 32) {
  throw new Error("JWT_ACCESS_SECRET must be at least 32 characters");
}

const env = {
  port: Number(process.env.PORT) || 5000,
  nodeEnv,
  clientUrl: process.env.CLIENT_URL || "http://localhost:5173",
  apiVersion: process.env.API_VERSION || "v1",

  mongo: {
    uri: process.env.MONGO_URI,
  },

  auth: {
    bcryptSaltRounds,
    jwtAccessSecret,
    jwtAccessExpires: process.env.JWT_ACCESS_EXPIRES_IN || "1d",
  },

  payment: {
    razorpay: {
      keyId: process.env.RAZORPAY_KEY_ID || "",
      keySecret: process.env.RAZORPAY_KEY_SECRET || "",
      currency: process.env.RAZORPAY_CURRENCY || "INR",
      webhookSecret: process.env.RAZORPAY_WEBHOOK_SECRET || "",
    },
  },

  email: {
    enabled: process.env.EMAIL_ENABLED === "true",
    host: process.env.EMAIL_HOST || "",
    port: Number(process.env.EMAIL_PORT) || 587,
    secure: process.env.EMAIL_SECURE === "true",
    user: process.env.EMAIL_USER || "",
    pass: process.env.EMAIL_PASS || "",
    fromName: process.env.EMAIL_FROM_NAME || "MarketFlow",
    fromAddress: process.env.EMAIL_FROM_ADDRESS || "no-reply@marketflow.com",
  },

  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || "",
    apiKey: process.env.CLOUDINARY_API_KEY || "",
    apiSecret: process.env.CLOUDINARY_API_SECRET || "",
    productFolder:
      process.env.CLOUDINARY_PRODUCT_FOLDER || "marketflow/products",
    categoryFolder:
      process.env.CLOUDINARY_CATEGORY_FOLDER || "marketflow/categories",
    avatarFolder: process.env.CLOUDINARY_AVATAR_FOLDER || "marketflow/avatars",
  },

  security: {
    corsAllowedOrigins: parseAllowedOrigins(
      process.env.CORS_ALLOWED_ORIGINS || process.env.CLIENT_URL,
    ),

    globalRateLimit: {
      windowMs:
        (Number(process.env.GLOBAL_RATE_LIMIT_WINDOW_MINUTES) || 15) *
        60 *
        1000,
      max: Number(process.env.GLOBAL_RATE_LIMIT_MAX_REQUESTS) || 500,
    },

    authRateLimit: {
      windowMs:
        (Number(process.env.AUTH_RATE_LIMIT_WINDOW_MINUTES) || 15) * 60 * 1000,
      max: Number(process.env.AUTH_RATE_LIMIT_MAX_REQUESTS) || 20,
    },
  },

  isDevelopment: nodeEnv === "development",
  isTest: nodeEnv === "test",
  isProduction: nodeEnv === "production",
};

export default env;
