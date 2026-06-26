import { isNonEmptyString, isNumber } from "../utils/validators.js";

const allowedCreateReviewFields = ["rating", "comment"];
const allowedUpdateReviewFields = ["rating", "comment"];

function validateRating(value, errors) {
  if (!isNumber(value)) {
    errors.push("Rating is required and must be a number");
    return;
  }

  if (!Number.isInteger(value)) {
    errors.push("Rating must be an integer");
  }

  if (value < 1 || value > 5) {
    errors.push("Rating must be between 1 and 5");
  }
}

function validateComment(value, errors, fieldName = "Comment") {
  if (!isNonEmptyString(value)) {
    errors.push(`${fieldName} is required and must be a non-empty string`);
    return;
  }

  if (value.trim().length < 3) {
    errors.push(`${fieldName} must be at least 3 characters`);
  }

  if (value.trim().length > 1000) {
    errors.push(`${fieldName} cannot exceed 1000 characters`);
  }
}

function validateCreateReview(body) {
  const errors = [];
  const bodyKeys = Object.keys(body);

  bodyKeys.forEach((key) => {
    if (!allowedCreateReviewFields.includes(key)) {
      errors.push(`${key} is not an allowed create review field`);
    }
  });

  validateRating(body.rating, errors);
  validateComment(body.comment, errors);

  return errors;
}

function validateUpdateReview(body) {
  const errors = [];
  const bodyKeys = Object.keys(body);

  if (bodyKeys.length === 0) {
    errors.push("At least one review field is required for update");
  }

  bodyKeys.forEach((key) => {
    if (!allowedUpdateReviewFields.includes(key)) {
      errors.push(`${key} is not an allowed update review field`);
    }
  });

  if (body.rating !== undefined) {
    validateRating(body.rating, errors);
  }

  if (body.comment !== undefined) {
    validateComment(body.comment, errors);
  }

  return errors;
}

export { validateCreateReview, validateUpdateReview };
