import mongoose from "mongoose";

const allowedQueryKeys = [
  "search",
  "category",
  "brand",
  "isActive",
  "isFeatured",
  "minPrice",
  "maxPrice",
  "sort",
  "order",
  "page",
  "limit",
];

const allowedBooleanValues = ["true", "false"];

const allowedSortFields = [
  "name",
  "price",
  "ratingsAverage",
  "stock",
  "createdAt",
  "updatedAt",
];

const allowedOrders = ["asc", "desc"];

function isPositiveIntegerString(value) {
  return /^\d+$/.test(value);
}

function isNonNegativeNumberString(value) {
  return value !== "" && !Number.isNaN(Number(value)) && Number(value) >= 0;
}

function validateProductQuery(query) {
  const errors = [];

  Object.keys(query).forEach((key) => {
    if (!allowedQueryKeys.includes(key)) {
      errors.push(`${key} is not an allowed query parameter`);
    }
  });

  if (
    query.search !== undefined &&
    (typeof query.search !== "string" || query.search.trim().length > 100)
  ) {
    errors.push("search must be a string with maximum 100 characters");
  }

  if (
    query.category !== undefined &&
    !mongoose.Types.ObjectId.isValid(query.category)
  ) {
    errors.push("category must be a valid MongoDB id");
  }

  if (
    query.brand !== undefined &&
    (typeof query.brand !== "string" || query.brand.trim().length > 80)
  ) {
    errors.push("brand must be a string with maximum 80 characters");
  }

  if (
    query.isActive !== undefined &&
    !allowedBooleanValues.includes(query.isActive)
  ) {
    errors.push("isActive must be true or false");
  }

  if (
    query.isFeatured !== undefined &&
    !allowedBooleanValues.includes(query.isFeatured)
  ) {
    errors.push("isFeatured must be true or false");
  }

  if (
    query.minPrice !== undefined &&
    !isNonNegativeNumberString(query.minPrice)
  ) {
    errors.push("minPrice must be a non-negative number");
  }

  if (
    query.maxPrice !== undefined &&
    !isNonNegativeNumberString(query.maxPrice)
  ) {
    errors.push("maxPrice must be a non-negative number");
  }

  if (
    query.minPrice !== undefined &&
    query.maxPrice !== undefined &&
    isNonNegativeNumberString(query.minPrice) &&
    isNonNegativeNumberString(query.maxPrice) &&
    Number(query.minPrice) > Number(query.maxPrice)
  ) {
    errors.push("minPrice cannot be greater than maxPrice");
  }

  if (query.sort !== undefined && !allowedSortFields.includes(query.sort)) {
    errors.push(`sort must be one of: ${allowedSortFields.join(", ")}`);
  }

  if (query.order !== undefined && !allowedOrders.includes(query.order)) {
    errors.push("order must be asc or desc");
  }

  if (
    query.page !== undefined &&
    (!isPositiveIntegerString(query.page) || Number(query.page) < 1)
  ) {
    errors.push("page must be a positive number");
  }

  if (query.limit !== undefined) {
    if (!isPositiveIntegerString(query.limit)) {
      errors.push("limit must be a positive number");
    } else if (Number(query.limit) > 50) {
      errors.push("limit cannot be greater than 50");
    }
  }

  return errors;
}

export default validateProductQuery;
