import express from "express";

import Roles from "../constants/roles.js";

import {
  blockUserForAdmin,
  changeMyPassword,
  getAllUsersForAdmin,
  getMyProfile,
  getUserByIdForAdmin,
  unblockUserForAdmin,
  updateMyProfile,
} from "../controllers/user.controller.js";

import { authorizeRoles, protect } from "../middlewares/auth.middleware.js";

import validateRequest from "../middlewares/validateRequest.js";
import asyncHandler from "../utils/asyncHandler.js";

import {
  validateChangePassword,
  validateUpdateProfile,
} from "../validators/user.validator.js";

const router = express.Router();

router.get(
  "/admin",
  protect,
  authorizeRoles(Roles.ADMIN),
  asyncHandler(getAllUsersForAdmin),
);

router.get(
  "/admin/:userId",
  protect,
  authorizeRoles(Roles.ADMIN),
  asyncHandler(getUserByIdForAdmin),
);

router.put(
  "/admin/:userId/block",
  protect,
  authorizeRoles(Roles.ADMIN),
  asyncHandler(blockUserForAdmin),
);

router.put(
  "/admin/:userId/unblock",
  protect,
  authorizeRoles(Roles.ADMIN),
  asyncHandler(unblockUserForAdmin),
);

router
  .route("/profile")
  .get(protect, asyncHandler(getMyProfile))
  .put(
    protect,
    validateRequest(validateUpdateProfile),
    asyncHandler(updateMyProfile),
  );

router.put(
  "/change-password",
  protect,
  validateRequest(validateChangePassword),
  asyncHandler(changeMyPassword),
);

export default router;
