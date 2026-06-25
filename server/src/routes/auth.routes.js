import express from "express";

import {
  getMe,
  loginUser,
  registerUser,
} from "../controllers/auth.controller.js";

import { protect } from "../middlewares/auth.middleware.js";
import validateRequest from "../middlewares/validateRequest.js";
import asyncHandler from "../utils/asyncHandler.js";

import {
  validateLogin,
  validateRegister,
} from "../validators/auth.validator.js";

const router = express.Router();

router.post(
  "/register",
  validateRequest(validateRegister),
  asyncHandler(registerUser),
);

router.post("/login", validateRequest(validateLogin), asyncHandler(loginUser));

router.get("/me", protect, asyncHandler(getMe));

export default router;
