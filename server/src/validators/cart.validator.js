import { isMongoId, isNumber } from "../utils/validators.js";

const allowedAddToCartFields = ["productId", "quantity"];
const allowedUpdateCartItemFields = ["quantity"];

function validateQuantity(value, errors) {
  if (!isNumber(value)) {
    errors.push("Quantity is required and must be a number");
    return;
  }

  if (!Number.isInteger(value)) {
    errors.push("Quantity must be an integer");
  }

  if (value < 1) {
    errors.push("Quantity must be at least 1");
  }

  if (value > 10) {
    errors.push("Quantity cannot exceed 10");
  }
}

function validateAddToCart(body) {
  const errors = [];
  const bodyKeys = Object.keys(body);

  bodyKeys.forEach((key) => {
    if (!allowedAddToCartFields.includes(key)) {
      errors.push(`${key} is not an allowed add-to-cart field`);
    }
  });

  if (!isMongoId(body.productId)) {
    errors.push("Valid productId is required");
  }

  validateQuantity(body.quantity, errors);

  return errors;
}

function validateUpdateCartItemQuantity(body) {
  const errors = [];
  const bodyKeys = Object.keys(body);

  if (bodyKeys.length === 0) {
    errors.push("Quantity is required for cart item update");
  }

  bodyKeys.forEach((key) => {
    if (!allowedUpdateCartItemFields.includes(key)) {
      errors.push(`${key} is not an allowed cart item update field`);
    }
  });

  validateQuantity(body.quantity, errors);

  return errors;
}

export { validateAddToCart, validateUpdateCartItemQuantity };
