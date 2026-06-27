import crypto from "node:crypto";

import env from "../config/env.js";

function convertRupeesToPaise(amount) {
  return Math.round(amount * 100);
}

function safeCompare(valueA, valueB) {
  const bufferA = Buffer.from(valueA);
  const bufferB = Buffer.from(valueB);

  if (bufferA.length !== bufferB.length) {
    return false;
  }

  return crypto.timingSafeEqual(bufferA, bufferB);
}

function verifyRazorpaySignature({
  razorpayOrderId,
  razorpayPaymentId,
  razorpaySignature,
}) {
  const generatedSignature = crypto
    .createHmac("sha256", env.payment.razorpay.keySecret)
    .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    .digest("hex");

  return safeCompare(generatedSignature, razorpaySignature);
}

export { convertRupeesToPaise, verifyRazorpaySignature };
