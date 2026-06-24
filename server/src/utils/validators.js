import mongoose from "mongoose";

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim() !== "";
}

function isOptionalString(value) {
  return value === undefined || typeof value === "string";
}

function isBoolean(value) {
  return typeof value === "boolean";
}

function isOptionalBoolean(value) {
  return value === undefined || typeof value === "boolean";
}

function isNumber(value) {
  return typeof value === "number" && Number.isFinite(value);
}

function isOptionalNumber(value) {
  return value === undefined || isNumber(value);
}

function isNonNegativeNumber(value) {
  return isNumber(value) && value >= 0;
}

function isOptionalNonNegativeNumber(value) {
  return value === undefined || isNonNegativeNumber(value);
}

function isMongoId(value) {
  return typeof value === "string" && mongoose.Types.ObjectId.isValid(value);
}

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function isOptionalImageObject(value) {
  if (value === undefined) {
    return true;
  }

  if (!isPlainObject(value)) {
    return false;
  }

  const isValidUrl = value.url === undefined || typeof value.url === "string";

  const isValidPublicId =
    value.publicId === undefined || typeof value.publicId === "string";

  return isValidUrl && isValidPublicId;
}

function isOptionalArray(value) {
  return value === undefined || Array.isArray(value);
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
