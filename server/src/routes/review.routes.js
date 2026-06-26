import express from "express";

import {
  createProductReview,
  deleteMyProductReview,
  getProductReviews,
  updateMyProductReview,
} from "../controllers/review.controller.js";

import { protect } from "../middlewares/auth.middleware.js";
import validateRequest from "../middlewares/validateRequest.js";
import asyncHandler from "../utils/asyncHandler.js";

import {
  validateCreateReview,
  validateUpdateReview,
} from "../validators/review.validator.js";

const router = express.Router({
  mergeParams: true,
});

router
  .route("/")
  .get(asyncHandler(getProductReviews))
  .post(
    protect,
    validateRequest(validateCreateReview),
    asyncHandler(createProductReview),
  );

router
  .route("/:reviewId")
  .put(
    protect,
    validateRequest(validateUpdateReview),
    asyncHandler(updateMyProductReview),
  )
  .delete(protect, asyncHandler(deleteMyProductReview));

export default router;
