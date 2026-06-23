import dotenv from "dotenv";
dotenv.config();

const allowedFields = ["development", "test", "production"];

const nodeEnv = process.env.NODE_ENV || "development";

if (!allowedFields.includes(nodeEnv)) {
  throw new Error(
    `Invalid NODE_ENV. Allowed values: ${allowedFields.join(", ")}`,
  );
}

const env = {
  port: Number(process.env.PORT) || 5000,
  nodeEnv,
  clientUrl: process.env.CLIENT_URL || "http://localhost:5173",
  apiVersion: process.env.API_VERSION || "v1",

  isDevelopment: nodeEnv === "development",
  isTest: nodeEnv === "test",
  isProduction: nodeEnv === "production",
};

export default env;
