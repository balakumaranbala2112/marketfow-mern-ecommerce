import {
  isNonEmptyString,
  isOptionalString,
  isPlainObject,
} from "../utils/validators.js";

const allowedCreateOrderFields = ["shippingAddress", "paymentMethod"];

const allowedShippingAddressFields = [
  "fullName",
  "phone",
  "addressLine1",
  "addressLine2",
  "city",
  "state",
  "postalCode",
  "country",
];

const allowedPaymentMethods = ["cod"];

const allowedUpdateOrderStatusFields = ["orderStatus"];

const allowedOrderStatuses = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

function validateShippingAddress(shippingAddress, errors) {
  if (!isPlainObject(shippingAddress)) {
    errors.push("Shipping address is required and must be an object");
    return;
  }

  Object.keys(shippingAddress).forEach((key) => {
    if (!allowedShippingAddressFields.includes(key)) {
      errors.push(`${key} is not an allowed shipping address field`);
    }
  });

  if (!isNonEmptyString(shippingAddress.fullName)) {
    errors.push("Shipping fullName is required");
  }

  if (!isNonEmptyString(shippingAddress.phone)) {
    errors.push("Shipping phone is required");
  }

  if (!isNonEmptyString(shippingAddress.addressLine1)) {
    errors.push("Shipping addressLine1 is required");
  }

  if (!isOptionalString(shippingAddress.addressLine2)) {
    errors.push("Shipping addressLine2 must be a string");
  }

  if (!isNonEmptyString(shippingAddress.city)) {
    errors.push("Shipping city is required");
  }

  if (!isNonEmptyString(shippingAddress.state)) {
    errors.push("Shipping state is required");
  }

  if (!isNonEmptyString(shippingAddress.postalCode)) {
    errors.push("Shipping postalCode is required");
  }

  if (!isNonEmptyString(shippingAddress.country)) {
    errors.push("Shipping country is required");
  }
}

function validateCreateOrder(body) {
  const errors = [];
  const bodyKeys = Object.keys(body);

  bodyKeys.forEach((key) => {
    if (!allowedCreateOrderFields.includes(key)) {
      errors.push(`${key} is not an allowed create order field`);
    }
  });

  validateShippingAddress(body.shippingAddress, errors);

  if (!isNonEmptyString(body.paymentMethod)) {
    errors.push("Payment method is required");
  }

  if (
    isNonEmptyString(body.paymentMethod) &&
    !allowedPaymentMethods.includes(body.paymentMethod)
  ) {
    errors.push(
      `Payment method must be one of: ${allowedPaymentMethods.join(", ")}`,
    );
  }

  return errors;
}

function validateUpdateOrderStatus(body) {
  const errors = [];
  const bodyKeys = Object.keys(body);

  if (bodyKeys.length === 0) {
    errors.push("Order status is required for update");
  }

  bodyKeys.forEach((key) => {
    if (!allowedUpdateOrderStatusFields.includes(key)) {
      errors.push(`${key} is not an allowed order status update field`);
    }
  });

  if (!isNonEmptyString(body.orderStatus)) {
    errors.push("Order status is required");
  }

  if (
    isNonEmptyString(body.orderStatus) &&
    !allowedOrderStatuses.includes(body.orderStatus)
  ) {
    errors.push(
      `Order status must be one of: ${allowedOrderStatuses.join(", ")}`,
    );
  }

  return errors;
}

export { validateCreateOrder, validateUpdateOrderStatus };
