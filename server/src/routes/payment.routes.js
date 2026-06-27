import express from "express";

import Roles from "../constants/roles.js";

import {
  cleanupPendingOnlineOrders,
  createRazorpayOrderFromCart,
  markRazorpayPaymentFailed,
  retryRazorpayPayment,
  verifyRazorpayPayment,
} from "../controllers/payment.controller.js";

import { authorizeRoles, protect } from "../middlewares/auth.middleware.js";

import validateRequest from "../middlewares/validateRequest.js";
import asyncHandler from "../utils/asyncHandler.js";

import {
  validateCreateRazorpayOrder,
  validateRazorpayPaymentFailure,
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

router.post(
  "/razorpay/failure",
  protect,
  validateRequest(validateRazorpayPaymentFailure),
  asyncHandler(markRazorpayPaymentFailed),
);

router.post(
  "/razorpay/retry/:orderId",
  protect,
  asyncHandler(retryRazorpayPayment),
);

router.put(
  "/admin/cleanup-pending-online-orders",
  protect,
  authorizeRoles(Roles.ADMIN),
  asyncHandler(cleanupPendingOnlineOrders),
);

export default router;
