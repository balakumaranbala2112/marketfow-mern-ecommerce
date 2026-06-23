import app from "./src/app.js";
import env from "./src/config/env.js";

const server = app.listen(env.port, () => {
  console.log(`MarketFlow API running on http://localhost:${env.port}`);
  console.log(`Environment: ${env.nodeEnv}`);
});

server.on("error", (err) => {
  console.error("Server startup error: ", err.message);
  process.exit(1);
});

process.on("SIGINT", () => {
  console.log("SIGINT received. Shutting down server...");

  server.close(() => {
    console.log("Server closed.");
    process.exit(0);
  });
});

process.on("SIGTERM", () => {
  console.log("SIGTERM received. Shutting down server...");

  server.close(() => {
    console.log("Server closed.");
    process.exit(0);
  });
});
