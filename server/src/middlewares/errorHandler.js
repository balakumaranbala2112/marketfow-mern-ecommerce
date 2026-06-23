import env from "../config/env.js";
import StatusCodes from "../constants/statusCodes.js";

function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }

  if (err.name === "CastError") {
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: "Invalid ID format",
      errors: [`Invalid ${err.path}: ${err.value}`],
      ...(env.isDevelopment && { stack: err.stack }),
    });
  }

  if (err.name === "ValidationError") {
    const errors = Object.values(err.errors).map((error) => error.message);

    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: "Validation failed",
      errors,
      ...(env.isDevelopment && { stack: err.stack }),
    });
  }

  if (err.code === 11000) {
    const fields = Object.keys(err.keyValue || {});
    const errors = fields.map((field) => `${field} already exists`);

    return res.status(StatusCodes.CONFLICT).json({
      success: false,
      message: "Duplicate field value",
      errors,
      ...(env.isDevelopment && { stack: err.stack }),
    });
  }

  const statusCode =
    err.statusCode || err.status || StatusCodes.INTERNAL_SERVER_ERROR;

  if (statusCode >= StatusCodes.INTERNAL_SERVER_ERROR) {
    console.error(err);
  }

  const response = {
    success: false,
    message:
      statusCode >= StatusCodes.INTERNAL_SERVER_ERROR
        ? "Internal server error"
        : err.message,
    errors: err.details || null,
  };

  if (env.isDevelopment) {
    response.stack = err.stack;
  }

  return res.status(statusCode).json(response);
}

export default errorHandler;
