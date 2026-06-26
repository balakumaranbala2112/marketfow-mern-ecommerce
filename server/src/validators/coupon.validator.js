import {
  isBoolean,
  isNonEmptyString,
  isNumber,
  isOptionalBoolean,
  isOptionalNumber,
  isOptionalString,
} from "../utils/validators.js";

const allowedCreateCouponFields = [
  "code",
  "description",
  "discountType",
  "discountValue",
  "minOrderAmount",
  "maxDiscountAmount",
  "usageLimit",
  "startsAt",
  "expiresAt",
  "isActive",
];

const allowedApplyCouponFields = ["code"];

const allowedDiscountTypes = ["percentage", "fixed"];

function isValidDateString(value) {
  return !Number.isNaN(Date.parse(value));
}

function validateCreateCoupon(body) {
  const errors = [];
  const bodyKeys = Object.keys(body);

  bodyKeys.forEach((key) => {
    if (!allowedCreateCouponFields.includes(key)) {
      errors.push(`${key} is not an allowed coupon field`);
    }
  });

  if (!isNonEmptyString(body.code)) {
    errors.push("Coupon code is required");
  }

  if (isNonEmptyString(body.code) && body.code.trim().length < 3) {
    errors.push("Coupon code must be at least 3 characters");
  }

  if (isNonEmptyString(body.code) && body.code.trim().length > 30) {
    errors.push("Coupon code cannot exceed 30 characters");
  }

  if (!isOptionalString(body.description)) {
    errors.push("Coupon description must be a string");
  }

  if (!isNonEmptyString(body.discountType)) {
    errors.push("Discount type is required");
  }

  if (
    isNonEmptyString(body.discountType) &&
    !allowedDiscountTypes.includes(body.discountType)
  ) {
    errors.push("Discount type must be percentage or fixed");
  }

  if (!isNumber(body.discountValue)) {
    errors.push("Discount value is required and must be a number");
  }

  if (isNumber(body.discountValue) && body.discountValue < 1) {
    errors.push("Discount value must be at least 1");
  }

  if (
    body.discountType === "percentage" &&
    isNumber(body.discountValue) &&
    body.discountValue > 100
  ) {
    errors.push("Percentage discount value cannot exceed 100");
  }

  if (!isOptionalNumber(body.minOrderAmount)) {
    errors.push("Minimum order amount must be a number");
  }

  if (isNumber(body.minOrderAmount) && body.minOrderAmount < 0) {
    errors.push("Minimum order amount cannot be negative");
  }

  if (!isOptionalNumber(body.maxDiscountAmount)) {
    errors.push("Maximum discount amount must be a number");
  }

  if (isNumber(body.maxDiscountAmount) && body.maxDiscountAmount < 0) {
    errors.push("Maximum discount amount cannot be negative");
  }

  if (!isOptionalNumber(body.usageLimit)) {
    errors.push("Usage limit must be a number");
  }

  if (
    isNumber(body.usageLimit) &&
    (!Number.isInteger(body.usageLimit) || body.usageLimit < 1)
  ) {
    errors.push("Usage limit must be a positive integer");
  }

  if (
    body.startsAt !== undefined &&
    (!isNonEmptyString(body.startsAt) || !isValidDateString(body.startsAt))
  ) {
    errors.push("startsAt must be a valid date string");
  }

  if (
    body.expiresAt !== undefined &&
    (!isNonEmptyString(body.expiresAt) || !isValidDateString(body.expiresAt))
  ) {
    errors.push("expiresAt must be a valid date string");
  }

  if (
    body.startsAt !== undefined &&
    body.expiresAt !== undefined &&
    isValidDateString(body.startsAt) &&
    isValidDateString(body.expiresAt) &&
    new Date(body.startsAt) >= new Date(body.expiresAt)
  ) {
    errors.push("startsAt must be before expiresAt");
  }

  if (!isOptionalBoolean(body.isActive)) {
    errors.push("isActive must be a boolean");
  }

  return errors;
}

function validateApplyCoupon(body) {
  const errors = [];
  const bodyKeys = Object.keys(body);

  bodyKeys.forEach((key) => {
    if (!allowedApplyCouponFields.includes(key)) {
      errors.push(`${key} is not an allowed apply coupon field`);
    }
  });

  if (!isNonEmptyString(body.code)) {
    errors.push("Coupon code is required");
  }

  return errors;
}

export { validateCreateCoupon, validateApplyCoupon };
