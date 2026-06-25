import express from "express";

import { loginUser, registerUser } from "../controllers/auth.controller.js";
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

export default router;
