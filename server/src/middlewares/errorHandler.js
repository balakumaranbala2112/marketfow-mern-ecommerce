import env from "../config/env.js";

function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }

  const statusCode = err.statusCode || err.status || 500;

  if (statusCode >= 500) {
    console.error(err);
  }

  const response = {
    success: false,
    message: statusCode >= 500 ? "Internal server error" : err.message,
    errors: err.details || null,
  };

  if (env.isDevelopment) {
    response.stack = err.stack;
  }

  return res.status(statusCode).json(response);
}

export default errorHandler;
