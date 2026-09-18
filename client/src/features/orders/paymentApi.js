import apiClient from "../../lib/axiosInstance.js";

export function createRazorpayOrder({ shippingAddress }) {
  return apiClient.post("/payments/razorpay/create-order", { shippingAddress });
}

export function verifyRazorpayPayment({
  orderId,
  razorpay_order_id,
  razorpay_payment_id,
  razorpay_signature,
}) {
  return apiClient.post("/payments/razorpay/verify", {
    orderId,
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
  });
}

export function markRazorpayPaymentFailed({
  orderId,
  razorpay_order_id,
  razorpay_payment_id,
  reason,
}) {
  return apiClient.post("/payments/razorpay/failure", {
    orderId,
    razorpay_order_id,
    razorpay_payment_id,
    reason,
  });
}
