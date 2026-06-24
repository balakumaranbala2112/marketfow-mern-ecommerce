import express from "express";

import asyncHandler from "../utils/asyncHandler.js";
import validateRequest from "../middlewares/validateRequest.js";
import validateQueryRequest from "../middlewares/validateQueryRequest.js";

import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
  updateProduct,
} from "../controllers/product.controller.js";

import {
  validateCreateProduct,
  validateUpdateProduct,
} from "../validators/product.validator.js";

import validateProductQuery from "../validators/productQuery.validator.js";

const router = express.Router();

router
  .route("/")
  .get(validateQueryRequest(validateProductQuery), asyncHandler(getAllProducts))
  .post(validateRequest(validateCreateProduct), asyncHandler(createProduct));

router
  .route("/:productId")
  .get(asyncHandler(getProductById))
  .put(validateRequest(validateUpdateProduct), asyncHandler(updateProduct))
  .delete(asyncHandler(deleteProduct));

export default router;
