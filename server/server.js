import app from "./src/app.js";
import env from "./src/config/env.js";
import { connectDB, disconnectDB } from "./src/config/db.js";

let server;

async function startServer() {
  await connectDB();

  // Start accepting requests only after database connection succeeds.
  server = app.listen(env.port, () => {
    console.log(`MarketFlow API running on http://localhost:${env.port}`);
    console.log(`Environment: ${env.nodeEnv}`);
  });

  server.on("error", (err) => {
    console.error("Server startup error:", err.message);
    process.exit(1);
  });
}

function shutdown(signal) {
  console.log(`${signal} received. Shutting down gracefully...`);

  if (!server) {
    process.exit(0);
  }

  // Stop HTTP server first, then close database connection.
  server.close(async () => {
    console.log("HTTP server closed.");
    await disconnectDB();
    process.exit(0);
  });
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

process.on("unhandledRejection", (reason) => {
  console.error("Unhandled rejection:", reason);

  if (server) {
    server.close(async () => {
      await disconnectDB();
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught exception:", err);
  process.exit(1);
});

startServer();
