import app from "./src/app.js";
import env from "./src/config/env.js";
import { connectDB } from "./src/config/db.js";
import logger from "./src/config/logger.js";

let server;

process.on("uncaughtException", (err) => {
  logger.error("UNCAUGHT EXCEPTION. Shutting down...", err);
  process.exit(1);
});

async function startServer() {
  await connectDB();

  server = app.listen(env.port, () => {
    logger.info(`MarketFlow API running on http://localhost:${env.port}`);
    logger.info(`Environment: ${env.nodeEnv}`);
  });
}

startServer().catch((err) => {
  logger.error("Server startup failed", err);
  process.exit(1);
});

process.on("unhandledRejection", (err) => {
  logger.error("UNHANDLED REJECTION. Shutting down...", err);

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});

process.on("SIGTERM", () => {
  logger.info("SIGTERM received. Shutting down gracefully.");

  if (server) {
    server.close(() => {
      logger.info("Process terminated.");
    });
  }
});
