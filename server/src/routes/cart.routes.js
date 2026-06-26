import express from "express";

import {
  addToCart,
  clearCart,
  getMyCart,
  removeCartItem,
  updateCartItemQuantity,
} from "../controllers/cart.controller.js";

import { protect } from "../middlewares/auth.middleware.js";
import validateRequest from "../middlewares/validateRequest.js";
import asyncHandler from "../utils/asyncHandler.js";

import {
  validateAddToCart,
  validateUpdateCartItemQuantity,
} from "../validators/cart.validator.js";

const router = express.Router();

router
  .route("/")
  .get(protect, asyncHandler(getMyCart))
  .delete(protect, asyncHandler(clearCart));

router.post(
  "/items",
  protect,
  validateRequest(validateAddToCart),
  asyncHandler(addToCart),
);

router
  .route("/items/:cartItemId")
  .put(
    protect,
    validateRequest(validateUpdateCartItemQuantity),
    asyncHandler(updateCartItemQuantity),
  )
  .delete(protect, asyncHandler(removeCartItem));

export default router;
