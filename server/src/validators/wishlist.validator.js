import { isMongoId } from "../utils/validators.js";

const allowedAddToWishlistFields = ["productId"];

function validateAddToWishlist(body) {
  const errors = [];
  const bodyKeys = Object.keys(body);

  bodyKeys.forEach((key) => {
    if (!allowedAddToWishlistFields.includes(key)) {
      errors.push(`${key} is not an allowed wishlist field`);
    }
  });

  if (!isMongoId(body.productId)) {
    errors.push("Valid productId is required");
  }

  return errors;
}

export { validateAddToWishlist };
