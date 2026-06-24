import express from "express";

import asyncHandler from "../utils/asyncHandler.js";
import validateRequest from "../middlewares/validateRequest.js";

import { createProduct } from "../controllers/product.controller.js";
import { validateCreateProduct } from "../validators/product.validator.js";

const router = express.Router();

router
  .route("/")
  .post(validateRequest(validateCreateProduct), asyncHandler(createProduct));

export default router;
