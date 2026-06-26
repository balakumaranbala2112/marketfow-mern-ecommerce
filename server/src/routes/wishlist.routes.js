import express from "express";

import {
  addToWishlist,
  getMyWishlist,
  removeFromWishlist,
} from "../controllers/wishlist.controller.js";

import { protect } from "../middlewares/auth.middleware.js";
import validateRequest from "../middlewares/validateRequest.js";
import asyncHandler from "../utils/asyncHandler.js";
import { validateAddToWishlist } from "../validators/wishlist.validator.js";

const router = express.Router();

router.get("/", protect, asyncHandler(getMyWishlist));

router.post(
  "/items",
  protect,
  validateRequest(validateAddToWishlist),
  asyncHandler(addToWishlist),
);

router.delete("/items/:productId", protect, asyncHandler(removeFromWishlist));

export default router;
