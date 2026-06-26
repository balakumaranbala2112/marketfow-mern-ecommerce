import express from "express";

import { addToCart } from "../controllers/cart.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import validateRequest from "../middlewares/validateRequest.js";
import asyncHandler from "../utils/asyncHandler.js";
import { validateAddToCart } from "../validators/cart.validator.js";

const router = express.Router();

router.post(
  "/items",
  protect,
  validateRequest(validateAddToCart),
  asyncHandler(addToCart),
);

export default router;
