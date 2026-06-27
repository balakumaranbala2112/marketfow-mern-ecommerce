import {
  isNonEmptyString,
  isOptionalString,
  isPlainObject,
} from "../utils/validators.js";

const allowedCreateRazorpayOrderFields = ["shippingAddress"];

const allowedVerifyPaymentFields = [
  "orderId",
  "razorpay_order_id",
  "razorpay_payment_id",
  "razorpay_signature",
];

const allowedFailureFields = [
  "orderId",
  "razorpay_order_id",
  "razorpay_payment_id",
  "reason",
];

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

function validateCreateRazorpayOrder(body) {
  const errors = [];
  const bodyKeys = Object.keys(body);

  bodyKeys.forEach((key) => {
    if (!allowedCreateRazorpayOrderFields.includes(key)) {
      errors.push(`${key} is not an allowed Razorpay order field`);
    }
  });

  validateShippingAddress(body.shippingAddress, errors);

  return errors;
}

function validateVerifyRazorpayPayment(body) {
  const errors = [];
  const bodyKeys = Object.keys(body);

  bodyKeys.forEach((key) => {
    if (!allowedVerifyPaymentFields.includes(key)) {
      errors.push(`${key} is not an allowed payment verification field`);
    }
  });

  if (!isNonEmptyString(body.orderId)) {
    errors.push("Local orderId is required");
  }

  if (!isNonEmptyString(body.razorpay_order_id)) {
    errors.push("razorpay_order_id is required");
  }

  if (!isNonEmptyString(body.razorpay_payment_id)) {
    errors.push("razorpay_payment_id is required");
  }

  if (!isNonEmptyString(body.razorpay_signature)) {
    errors.push("razorpay_signature is required");
  }

  return errors;
}

function validateRazorpayPaymentFailure(body) {
  const errors = [];
  const bodyKeys = Object.keys(body);

  bodyKeys.forEach((key) => {
    if (!allowedFailureFields.includes(key)) {
      errors.push(`${key} is not an allowed payment failure field`);
    }
  });

  if (!isNonEmptyString(body.orderId)) {
    errors.push("Local orderId is required");
  }

  if (!isNonEmptyString(body.razorpay_order_id)) {
    errors.push("razorpay_order_id is required");
  }

  if (!isOptionalString(body.razorpay_payment_id)) {
    errors.push("razorpay_payment_id must be a string");
  }

  if (!isOptionalString(body.reason)) {
    errors.push("reason must be a string");
  }

  return errors;
}

export {
  validateCreateRazorpayOrder,
  validateVerifyRazorpayPayment,
  validateRazorpayPaymentFailure,
};
