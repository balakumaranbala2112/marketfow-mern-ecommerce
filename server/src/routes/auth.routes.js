import express from "express";

import {
  forgotPassword,
  getMe,
  loginUser,
  registerUser,
  resetPassword,
} from "../controllers/auth.controller.js";

import { protect } from "../middlewares/auth.middleware.js";
import validateRequest from "../middlewares/validateRequest.js";
import asyncHandler from "../utils/asyncHandler.js";

import {
  validateLogin,
  validateRegister,
  validateForgotPassword,
  validateResetPassword,
} from "../validators/auth.validator.js";

const router = express.Router();

// NOTE: authRateLimiter is already applied at the route-group level in app.js
// (app.use("/api/v1/auth", authRateLimiter(), authRoutes)), so individual
// per-route rate limiters are not needed here.

router.post(
  "/register",
  validateRequest(validateRegister),
  asyncHandler(registerUser),
);

router.post("/login", validateRequest(validateLogin), asyncHandler(loginUser));

router.post(
  "/forgot-password",
  validateRequest(validateForgotPassword),
  asyncHandler(forgotPassword),
);

// Alias for the common "/forget-password" misspelling.
router.post(
  "/forget-password",
  validateRequest(validateForgotPassword),
  asyncHandler(forgotPassword),
);

router.post(
  "/reset-password/:resetToken",
  validateRequest(validateResetPassword),
  asyncHandler(resetPassword),
);

router.get("/me", protect, asyncHandler(getMe));

export default router;
