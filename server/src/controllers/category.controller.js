import Category from "../models/category.model.js";

import StatusCodes from "../constants/statusCodes.js";
import AppError from "../utils/AppError.js";
import createSlug from "../utils/createSlug.js";
import sendResponse from "../utils/sendResponse.js";
import removeUndefinedFields from "../utils/removeUndefinedFields.js";

async function createCategory(req, res) {
  const { name, description, image, isActive } = req.body;

  const category = await Category.create({
    name,
    slug: createSlug(name),
    description,
    image,
    isActive,
  });

  return sendResponse(
    res,
    StatusCodes.CREATED,
    "Category created successfully",
    category,
  );
}

async function getAllCategories(req, res) {
  const categories = await Category.find().sort({ createdAt: -1 });

  return sendResponse(
    res,
    StatusCodes.OK,
    "Categories fetched successfully",
    categories,
    {
      count: categories.length,
    },
  );
}

async function getCategoryById(req, res, next) {
  const { categoryId } = req.params;

  const category = await Category.findById(categoryId);

  if (!category) {
    return next(new AppError(StatusCodes.NOT_FOUND, "Category not found"));
  }

  return sendResponse(
    res,
    StatusCodes.OK,
    "Category fetched successfully",
    category,
  );
}

async function updateCategory(req, res, next) {
  const { categoryId } = req.params;
  const { name, description, image, isActive } = req.body;

  let updateData = {
    description,
    image,
    isActive,
  };

  // Keep slug synced when the category name changes.
  if (name !== undefined) {
    updateData.name = name;
    updateData.slug = createSlug(name);
  }

  updateData = removeUndefinedFields(updateData);

  const category = await Category.findByIdAndUpdate(categoryId, updateData, {
    new: true,
    runValidators: true,
  });

  if (!category) {
    return next(new AppError(StatusCodes.NOT_FOUND, "Category not found"));
  }

  return sendResponse(
    res,
    StatusCodes.OK,
    "Category updated successfully",
    category,
  );
}

async function deleteCategory(req, res, next) {
  const { categoryId } = req.params;

  const category = await Category.findByIdAndDelete(categoryId);

  if (!category) {
    return next(new AppError(StatusCodes.NOT_FOUND, "Category not found"));
  }

  return sendResponse(
    res,
    StatusCodes.OK,
    "Category deleted successfully",
    category,
  );
}

export {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
