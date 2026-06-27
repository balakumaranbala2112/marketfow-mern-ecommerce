import express from "express";

import {
  createRazorpayOrderFromCart,
  verifyRazorpayPayment,
} from "../controllers/payment.controller.js";

import { protect } from "../middlewares/auth.middleware.js";
import validateRequest from "../middlewares/validateRequest.js";
import asyncHandler from "../utils/asyncHandler.js";

import {
  validateCreateRazorpayOrder,
  validateVerifyRazorpayPayment,
} from "../validators/payment.validator.js";

const router = express.Router();

router.post(
  "/razorpay/create-order",
  protect,
  validateRequest(validateCreateRazorpayOrder),
  asyncHandler(createRazorpayOrderFromCart),
);

router.post(
  "/razorpay/verify",
  protect,
  validateRequest(validateVerifyRazorpayPayment),
  asyncHandler(verifyRazorpayPayment),
);

export default router;
