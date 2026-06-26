import { isMongoId, isNumber } from "../utils/validators.js";

const allowedAddToCartFields = ["productId", "quantity"];

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

  if (!isNumber(body.quantity)) {
    errors.push("Quantity is required and must be a number");
  }

  if (isNumber(body.quantity) && !Number.isInteger(body.quantity)) {
    errors.push("Quantity must be an integer");
  }

  if (isNumber(body.quantity) && body.quantity < 1) {
    errors.push("Quantity must be at least 1");
  }

  if (isNumber(body.quantity) && body.quantity > 10) {
    errors.push("Quantity cannot exceed 10 per request");
  }

  return errors;
}

export { validateAddToCart };
