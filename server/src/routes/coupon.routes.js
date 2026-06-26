import express from "express";

import Roles from "../constants/roles.js";

import {
  applyCouponToCart,
  createCouponForAdmin,
  getAllCouponsForAdmin,
  removeCouponFromCart,
} from "../controllers/coupon.controller.js";

import { authorizeRoles, protect } from "../middlewares/auth.middleware.js";

import validateRequest from "../middlewares/validateRequest.js";
import asyncHandler from "../utils/asyncHandler.js";

import {
  validateApplyCoupon,
  validateCreateCoupon,
} from "../validators/coupon.validator.js";

const router = express.Router();

router
  .route("/admin")
  .get(
    protect,
    authorizeRoles(Roles.ADMIN),
    asyncHandler(getAllCouponsForAdmin),
  )
  .post(
    protect,
    authorizeRoles(Roles.ADMIN),
    validateRequest(validateCreateCoupon),
    asyncHandler(createCouponForAdmin),
  );

router.post(
  "/apply",
  protect,
  validateRequest(validateApplyCoupon),
  asyncHandler(applyCouponToCart),
);

router.delete("/remove", protect, asyncHandler(removeCouponFromCart));

export default router;
