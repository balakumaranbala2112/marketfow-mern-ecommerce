import express from "express";

import Roles from "../constants/roles.js";

import {
  createOrderFromCart,
  getAllOrdersForAdmin,
  getMyOrderById,
  getMyOrders,
  getOrderByIdForAdmin,
  updateOrderStatusForAdmin,
} from "../controllers/order.controller.js";

import { authorizeRoles, protect } from "../middlewares/auth.middleware.js";

import validateRequest from "../middlewares/validateRequest.js";
import asyncHandler from "../utils/asyncHandler.js";

import {
  validateCreateOrder,
  validateUpdateOrderStatus,
} from "../validators/order.validator.js";

const router = express.Router();

router.post(
  "/",
  protect,
  validateRequest(validateCreateOrder),
  asyncHandler(createOrderFromCart),
);

router.get("/my-orders", protect, asyncHandler(getMyOrders));

router.get(
  "/admin",
  protect,
  authorizeRoles(Roles.ADMIN),
  asyncHandler(getAllOrdersForAdmin),
);

router.get(
  "/admin/:orderId",
  protect,
  authorizeRoles(Roles.ADMIN),
  asyncHandler(getOrderByIdForAdmin),
);

router.put(
  "/admin/:orderId/status",
  protect,
  authorizeRoles(Roles.ADMIN),
  validateRequest(validateUpdateOrderStatus),
  asyncHandler(updateOrderStatusForAdmin),
);

router.get("/:orderId", protect, asyncHandler(getMyOrderById));

export default router;
