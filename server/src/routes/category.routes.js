import express from "express";

import Roles from "../constants/roles.js";
import { authorizeRoles, protect } from "../middlewares/auth.middleware.js";
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
  .post(
    protect,
    authorizeRoles(Roles.ADMIN),
    validateRequest(validateCreateCategory),
    asyncHandler(createCategory),
  );

router
  .route("/:categoryId")
  .get(asyncHandler(getCategoryById))
  .put(
    protect,
    authorizeRoles(Roles.ADMIN),
    validateRequest(validateUpdateCategory),
    asyncHandler(updateCategory),
  )
  .delete(protect, authorizeRoles(Roles.ADMIN), asyncHandler(deleteCategory));

export default router;
