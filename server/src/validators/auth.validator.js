import { isNonEmptyString } from "../utils/validators.js";

const allowedRegisterFields = ["name", "email", "password"];
const allowedLoginFields = ["email", "password"];

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isStrongEnoughPassword(value) {
  return typeof value === "string" && value.length >= 8;
}

function validateRegister(body) {
  const errors = [];
  const bodyKeys = Object.keys(body);

  bodyKeys.forEach((key) => {
    if (!allowedRegisterFields.includes(key)) {
      errors.push(`${key} is not an allowed register field`);
    }
  });

  if (!isNonEmptyString(body.name)) {
    errors.push("Name is required and must be a non-empty string");
  }

  if (isNonEmptyString(body.name) && body.name.trim().length < 2) {
    errors.push("Name must be at least 2 characters");
  }

  if (isNonEmptyString(body.name) && body.name.trim().length > 60) {
    errors.push("Name cannot exceed 60 characters");
  }

  if (!isNonEmptyString(body.email)) {
    errors.push("Email is required and must be a non-empty string");
  }

  if (isNonEmptyString(body.email) && !isValidEmail(body.email.trim())) {
    errors.push("Please provide a valid email address");
  }

  if (!isNonEmptyString(body.password)) {
    errors.push("Password is required and must be a non-empty string");
  }

  if (
    isNonEmptyString(body.password) &&
    !isStrongEnoughPassword(body.password)
  ) {
    errors.push("Password must be at least 8 characters");
  }

  return errors;
}

function validateLogin(body) {
  const errors = [];
  const bodyKeys = Object.keys(body);

  bodyKeys.forEach((key) => {
    if (!allowedLoginFields.includes(key)) {
      errors.push(`${key} is not an allowed login field`);
    }
  });

  if (!isNonEmptyString(body.email)) {
    errors.push("Email is required and must be a non-empty string");
  }

  if (isNonEmptyString(body.email) && !isValidEmail(body.email.trim())) {
    errors.push("Please provide a valid email address");
  }

  if (!isNonEmptyString(body.password)) {
    errors.push("Password is required and must be a non-empty string");
  }

  return errors;
}

export { validateRegister, validateLogin };
