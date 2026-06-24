function isNonEmptyString(value) {
  return typeof value === "string" && value.trim() !== "";
}

function isOptionalString(value) {
  return value === undefined || typeof value === "string";
}

function isOptionalBoolean(value) {
  return value === undefined || typeof value === "boolean";
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

export {
  isNonEmptyString,
  isOptionalString,
  isOptionalBoolean,
  isOptionalImageObject,
};
