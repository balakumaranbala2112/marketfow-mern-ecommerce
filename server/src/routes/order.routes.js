import express from "express";

import { createOrderFromCart } from "../controllers/order.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import validateRequest from "../middlewares/validateRequest.js";
import asyncHandler from "../utils/asyncHandler.js";
import { validateCreateOrder } from "../validators/order.validator.js";

const router = express.Router();

router.post(
  "/",
  protect,
  validateRequest(validateCreateOrder),
  asyncHandler(createOrderFromCart),
);

export default router;
