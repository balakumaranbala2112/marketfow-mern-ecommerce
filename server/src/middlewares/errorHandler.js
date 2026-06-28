import env from "../config/env.js";
import logger from "../config/logger.js";
import StatusCodes from "../constants/statusCodes.js";
import { normalizeError } from "../utils/errorHelpers.js";

function sendErrorDev(err, res) {
  return res.status(err.statusCode).json({
    success: false,
    status: err.status,
    message: err.message,
    errors: err.errors,
    stack: err.stack,
    error: err,
  });
}

function sendErrorProd(err, res) {
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      success: false,
      status: err.status,
      message: err.message,
      errors: err.errors,
    });
  }

  return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    success: false,
    status: "error",
    message: "Something went wrong",
  });
}

function errorHandler(err, req, res, next) {
  let error = normalizeError(err);

  error.statusCode = error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
  error.status = error.status || "error";
  error.errors = error.errors || [];

  logger.error(
    `${req.method} ${req.originalUrl} ${error.statusCode} - ${error.message}`,
    {
      stack: error.stack,
      errors: error.errors,
    },
  );

  if (env.isDevelopment) {
    return sendErrorDev(error, res);
  }

  return sendErrorProd(error, res);
}

export default errorHandler;
