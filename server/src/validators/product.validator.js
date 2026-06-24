import {
  isMongoId,
  isNonEmptyString,
  isOptionalArray,
  isOptionalBoolean,
  isOptionalNonNegativeNumber,
  isOptionalString,
  isPlainObject,
  isNonNegativeNumber,
} from "../utils/validators.js";

function isValidProductImage(image) {
  return (
    isPlainObject(image) &&
    isNonEmptyString(image.url) &&
    isNonEmptyString(image.publicId) &&
    (image.alt === undefined || typeof image.alt === "string")
  );
}

function isValidSpecification(specification) {
  return (
    isPlainObject(specification) &&
    isNonEmptyString(specification.key) &&
    isNonEmptyString(specification.value)
  );
}

function validateCreateProduct(body) {
  const errors = [];

  if (!isNonEmptyString(body.name)) {
    errors.push("Product name is required and must be a non-empty string");
  }

  if (isNonEmptyString(body.name) && body.name.trim().length < 3) {
    errors.push("Product name must be at least 3 characters");
  }

  if (isNonEmptyString(body.name) && body.name.trim().length > 150) {
    errors.push("Product name cannot exceed 150 characters");
  }

  if (!isNonEmptyString(body.description)) {
    errors.push(
      "Product description is required and must be a non-empty string",
    );
  }

  if (
    isNonEmptyString(body.description) &&
    body.description.trim().length < 10
  ) {
    errors.push("Product description must be at least 10 characters");
  }

  if (!isOptionalString(body.shortDescription)) {
    errors.push("Product shortDescription must be a string");
  }

  if (
    isOptionalString(body.shortDescription) &&
    body.shortDescription !== undefined &&
    body.shortDescription.length > 300
  ) {
    errors.push("Product shortDescription cannot exceed 300 characters");
  }

  if (!isNonNegativeNumber(body.price)) {
    errors.push("Product price is required and must be a non-negative number");
  }

  if (!isOptionalNonNegativeNumber(body.discountPrice)) {
    errors.push("Product discountPrice must be a non-negative number");
  }

  if (
    body.discountPrice !== undefined &&
    isNonNegativeNumber(body.price) &&
    body.discountPrice >= body.price
  ) {
    errors.push("Product discountPrice must be less than product price");
  }

  if (!isMongoId(body.category)) {
    errors.push("Valid category id is required");
  }

  if (!isOptionalString(body.brand)) {
    errors.push("Product brand must be a string");
  }

  if (!isOptionalArray(body.images)) {
    errors.push("Product images must be an array");
  }

  if (
    Array.isArray(body.images) &&
    body.images.some((image) => !isValidProductImage(image))
  ) {
    errors.push("Each product image must have url and publicId");
  }

  if (!isNonNegativeNumber(body.stock)) {
    errors.push("Product stock is required and must be a non-negative number");
  }

  if (!isNonEmptyString(body.sku)) {
    errors.push("Product SKU is required and must be a non-empty string");
  }

  if (!isOptionalBoolean(body.isActive)) {
    errors.push("Product isActive must be a boolean");
  }

  if (!isOptionalBoolean(body.isFeatured)) {
    errors.push("Product isFeatured must be a boolean");
  }

  if (!isOptionalArray(body.specifications)) {
    errors.push("Product specifications must be an array");
  }

  if (
    Array.isArray(body.specifications) &&
    body.specifications.some(
      (specification) => !isValidSpecification(specification),
    )
  ) {
    errors.push("Each specification must have key and value");
  }

  return errors;
}

export { validateCreateProduct };
