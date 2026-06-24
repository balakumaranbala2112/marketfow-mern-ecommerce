const allowedQueryKeys = [
  "search",
  "isActive",
  "sort",
  "order",
  "page",
  "limit",
];

const allowedBooleanValues = ["true", "false"];

const allowedSortFields = ["name", "createdAt", "updatedAt"];

const allowedOrders = ["asc", "desc"];

function isPositiveIntegerString(value) {
  return /^\d+$/.test(value);
}

function validateCategoryQuery(query) {
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
    query.isActive !== undefined &&
    !allowedBooleanValues.includes(query.isActive)
  ) {
    errors.push("isActive must be true or false");
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

export default validateCategoryQuery;
