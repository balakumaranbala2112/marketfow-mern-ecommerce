import express from "express";

import asyncHandler from "../utils/asyncHandler.js";
import validateRequest from "../middlewares/validateRequest.js";
import validateQueryRequest from "../middlewares/validateQueryRequest.js";

import {
  validateCreateCategory,
  validateUpdateCategory,
} from "../validators/category.validator.js";

import validateCategoryQuery from "../validators/categoryQuery.validator.js";

import {
  createCategory,
  deleteCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
} from "../controllers/category.controller.js";

const router = express.Router();

router
  .route("/")
  .get(
    validateQueryRequest(validateCategoryQuery),
    asyncHandler(getAllCategories),
  )
  .post(validateRequest(validateCreateCategory), asyncHandler(createCategory));

router
  .route("/:categoryId")
  .get(asyncHandler(getCategoryById))
  .put(validateRequest(validateUpdateCategory), asyncHandler(updateCategory))
  .delete(asyncHandler(deleteCategory));

export default router;
