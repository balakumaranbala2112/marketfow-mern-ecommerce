import dotenv from "dotenv";

dotenv.config();

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

if (jwtAccessSecret.length < 32) {
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

  isDevelopment: nodeEnv === "development",
  isTest: nodeEnv === "test",
  isProduction: nodeEnv === "production",
};

export default env;
