import Razorpay from "razorpay";

import env from "./env.js";

function createRazorpayInstance() {
  return new Razorpay({
    key_id: env.payment.razorpay.keyId,
    key_secret: env.payment.razorpay.keySecret,
  });
}

export default createRazorpayInstance;
