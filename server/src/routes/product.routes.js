import express from "express";

import asyncHandler from "../utils/asyncHandler.js";
import validateRequest from "../middlewares/validateRequest.js";

import {
  createProduct,
  getAllProducts,
  getProductById,
} from "../controllers/product.controller.js";

import { validateCreateProduct } from "../validators/product.validator.js";

const router = express.Router();

router
  .route("/")
  .get(asyncHandler(getAllProducts))
  .post(validateRequest(validateCreateProduct), asyncHandler(createProduct));

router.route("/:productId").get(asyncHandler(getProductById));

export default router;
