import mongoose from "mongoose";
import logger from "./logger.js";
import env from "./env.js";

async function connectDB() {
  try {
    const connection = await mongoose.connect(env.mongo.uri);
    logger.info(`MongoDB connected: ${connection.connection.host}`);
  } catch (error) {
    logger.error("MongoDB connection failed", error.message);
    process.exit(1);
  }
}

async function disconnectDB() {
  await mongoose.disconnect();
  logger.info("MongoDB disconnected");
}

export { connectDB, disconnectDB };
