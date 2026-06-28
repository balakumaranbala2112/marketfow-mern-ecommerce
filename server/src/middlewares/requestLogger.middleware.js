import morgan from "morgan";

import logger from "../config/logger.js";
import env from "../config/env.js";

const stream = {
  write(message) {
    logger.http(message.trim());
  },
};

const skipSuccessfulRequestsInProduction = (req, res) => {
  return env.isProduction && res.statusCode < 400;
};

function requestLogger() {
  const format = env.isProduction ? "combined" : "dev";

  return morgan(format, {
    stream,
    skip: skipSuccessfulRequestsInProduction,
  });
}

export default requestLogger;
