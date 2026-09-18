import mongoose from "mongoose";

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim() !== "";
}

function isOptionalString(value) {
  return value === undefined || value === null || typeof value === "string";
}

function isBoolean(value) {
  return typeof value === "boolean";
}

function isOptionalBoolean(value) {
  return value === undefined || value === null || typeof value === "boolean";
}

function isNumber(value) {
  return typeof value === "number" && Number.isFinite(value);
}

function isOptionalNumber(value) {
  return value === undefined || value === null || isNumber(value);
}

function isNonNegativeNumber(value) {
  return isNumber(value) && value >= 0;
}

function isOptionalNonNegativeNumber(value) {
  return value === undefined || value === null || isNonNegativeNumber(value);
}

function isMongoId(value) {
  return typeof value === "string" && mongoose.Types.ObjectId.isValid(value);
}

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function isOptionalImageObject(value) {
  if (value === undefined || value === null) {
    return true;
  }

  if (!isPlainObject(value)) {
    return false;
  }

  const isValidUrl = value.url === undefined || value.url === null || typeof value.url === "string";

  const isValidPublicId =
    value.publicId === undefined || value.publicId === null || typeof value.publicId === "string";

  return isValidUrl && isValidPublicId;
}

function isOptionalArray(value) {
  return value === undefined || value === null || Array.isArray(value);
}

export {
  isNonEmptyString,
  isOptionalString,
  isBoolean,
  isOptionalBoolean,
  isNumber,
  isOptionalNumber,
  isNonNegativeNumber,
  isOptionalNonNegativeNumber,
  isMongoId,
  isPlainObject,
  isOptionalImageObject,
  isOptionalArray,
};
