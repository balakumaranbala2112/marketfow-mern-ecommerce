import express from "express";

import asyncHandler from "../utils/asyncHandler.js";
import validateRequest from "../middlewares/validateRequest.js";

import {
  createProduct,
  getAllProducts,
  getProductById,
  deleteProduct,
  updateProduct,
} from "../controllers/product.controller.js";

import {
  validateCreateProduct,
  validateUpdateProduct,
} from "../validators/product.validator.js";

const router = express.Router();

router
  .route("/")
  .get(asyncHandler(getAllProducts))
  .post(validateRequest(validateCreateProduct), asyncHandler(createProduct));

router
  .route("/:productId")
  .get(asyncHandler(getProductById))
  .put(validateRequest(validateUpdateProduct), asyncHandler(updateProduct))
  .delete(asyncHandler(deleteProduct));

export default router;
