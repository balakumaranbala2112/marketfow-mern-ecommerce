import express from "express";

import { registerUser } from "../controllers/auth.controller.js";
import validateRequest from "../middlewares/validateRequest.js";
import asyncHandler from "../utils/asyncHandler.js";
import { validateRegister } from "../validators/auth.validator.js";

const router = express.Router();

router.post(
  "/register",
  validateRequest(validateRegister),
  asyncHandler(registerUser),
);

export default router;
