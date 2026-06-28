import { isNonEmptyString } from "../utils/validators.js";

const allowedDeleteProductImageFields = ["publicId"];

function validateDeleteProductImage(body) {
  const errors = [];
  const bodyKeys = Object.keys(body);

  bodyKeys.forEach((key) => {
    if (!allowedDeleteProductImageFields.includes(key)) {
      errors.push(`${key} is not an allowed delete image field`);
    }
  });

  if (!isNonEmptyString(body.publicId)) {
    errors.push("publicId is required");
  }

  return errors;
}

export { validateDeleteProductImage };
