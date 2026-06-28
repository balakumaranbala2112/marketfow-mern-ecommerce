import winston from "winston";

import env from "./env.js";

const logFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.printf((info) => {
    return `${info.timestamp} [${info.level.toUpperCase()}]: ${info.message}${
      info.stack ? `\n${info.stack}` : ""
    }`;
  }),
);

const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  logFormat,
);

const transports = [
  new winston.transports.Console({
    format: consoleFormat,
  }),
];

if (env.isProduction) {
  transports.push(
    new winston.transports.File({
      filename: "logs/error.log",
      level: "error",
      format: logFormat,
    }),
    new winston.transports.File({
      filename: "logs/combined.log",
      format: logFormat,
    }),
  );
}

const logger = winston.createLogger({
  level: env.isProduction ? "info" : "debug",
  transports,
  exitOnError: false,
});

export default logger;
