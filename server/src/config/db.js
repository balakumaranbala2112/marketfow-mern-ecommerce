import mongoose from "mongoose";

import env from "./env.js";

async function connectDB() {
  try {
    const connection = await mongoose.connect(env.mongo.uri);
    console.log(`MongoDB connected: ${connection.connection.host}`);
  } catch (error) {
    console.error("MongoDB connection failed", error.message);
    process.exit(1);
  }
}

async function disconnectDB() {
  await mongoose.disconnect();
  console.log("MongoDB disconnected");
}

export { connectDB, disconnectDB };
