import multer from "multer";

import AppError from "./AppError.js";
import StatusCodes from "../constants/statusCodes.js";

function handleCastErrorDB(err) {
  return new AppError(
    StatusCodes.BAD_REQUEST,
    `Invalid ${err.path}: ${err.value}`,
  );
}

function handleDuplicateFieldsDB(err) {
  const duplicateFields = Object.keys(err.keyValue || {});
  const message =
    duplicateFields.length > 0
      ? `Duplicate field value: ${duplicateFields.join(", ")}`
      : "Duplicate field value";

  return new AppError(StatusCodes.CONFLICT, message);
}

function handleValidationErrorDB(err) {
  const errors = Object.values(err.errors || {}).map((item) => {
    return item.message;
  });

  return new AppError(StatusCodes.BAD_REQUEST, "Validation failed", errors);
}

function handleJWTError() {
  return new AppError(
    StatusCodes.UNAUTHORIZED,
    "Invalid token. Please login again.",
  );
}

function handleJWTExpiredError() {
  return new AppError(
    StatusCodes.UNAUTHORIZED,
    "Your token has expired. Please login again.",
  );
}

function handleMulterError(err) {
  if (err.code === "LIMIT_FILE_SIZE") {
    return new AppError(StatusCodes.BAD_REQUEST, "File too large");
  }

  if (err.code === "LIMIT_FILE_COUNT") {
    return new AppError(StatusCodes.BAD_REQUEST, "Too many files uploaded");
  }

  if (err.code === "LIMIT_UNEXPECTED_FILE") {
    return new AppError(StatusCodes.BAD_REQUEST, "Unexpected file field");
  }

  return new AppError(StatusCodes.BAD_REQUEST, err.message);
}

function normalizeError(err) {
  if (err.name === "CastError") {
    return handleCastErrorDB(err);
  }

  if (err.code === 11000) {
    return handleDuplicateFieldsDB(err);
  }

  if (err.name === "ValidationError") {
    return handleValidationErrorDB(err);
  }

  if (err.name === "JsonWebTokenError") {
    return handleJWTError();
  }

  if (err.name === "TokenExpiredError") {
    return handleJWTExpiredError();
  }

  if (err instanceof multer.MulterError) {
    return handleMulterError(err);
  }

  return err;
}

export { normalizeError };
