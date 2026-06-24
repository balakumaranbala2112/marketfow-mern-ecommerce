import {
  isNonEmptyString,
  isOptionalBoolean,
  isOptionalImageObject,
  isOptionalString,
} from "../utils/validators.js";

function validateCreateCategory(body) {
  const errors = [];

  if (!isNonEmptyString(body.name)) {
    errors.push("Category name is required and must be a non-empty string");
  }

  if (isNonEmptyString(body.name) && body.name.trim().length < 2) {
    errors.push("Category name must be at least 2 characters");
  }

  if (isNonEmptyString(body.name) && body.name.trim().length > 80) {
    errors.push("Category name cannot exceed 80 characters");
  }

  if (!isOptionalString(body.description)) {
    errors.push("Category description must be a string");
  }

  if (
    isOptionalString(body.description) &&
    body.description !== undefined &&
    body.description.length > 500
  ) {
    errors.push("Category description cannot exceed 500 characters");
  }

  if (!isOptionalImageObject(body.image)) {
    errors.push(
      "Category image must be an object with optional url and publicId",
    );
  }

  if (!isOptionalBoolean(body.isActive)) {
    errors.push("Category isActive must be a boolean");
  }

  return errors;
}

function validateUpdateCategory(body) {
  const errors = [];

  if (body.name !== undefined && !isNonEmptyString(body.name)) {
    errors.push("Category name must be a non-empty string");
  }

  if (isNonEmptyString(body.name) && body.name.trim().length < 2) {
    errors.push("Category name must be at least 2 characters");
  }

  if (isNonEmptyString(body.name) && body.name.trim().length > 80) {
    errors.push("Category name cannot exceed 80 characters");
  }

  if (!isOptionalString(body.description)) {
    errors.push("Category description must be a string");
  }

  if (
    isOptionalString(body.description) &&
    body.description !== undefined &&
    body.description.length > 500
  ) {
    errors.push("Category description cannot exceed 500 characters");
  }

  if (!isOptionalImageObject(body.image)) {
    errors.push(
      "Category image must be an object with optional url and publicId",
    );
  }

  if (!isOptionalBoolean(body.isActive)) {
    errors.push("Category isActive must be a boolean");
  }

  return errors;
}

export { validateCreateCategory, validateUpdateCategory };
