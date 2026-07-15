import mongoose from "mongoose";

import {
  deleteImageFromCloudinary,
  uploadCategoryImageFile,
} from "../services/cloudinary.service.js";

import Category from "../models/category.model.js";
import Product from "../models/product.model.js";

import StatusCodes from "../constants/statusCodes.js";
import ApiFeatures from "../utils/ApiFeatures.js";
import AppError from "../utils/AppError.js";
import createSlug from "../utils/createSlug.js";
import removeUndefinedFields from "../utils/removeUndefinedFields.js";
import sendResponse from "../utils/sendResponse.js";

function validateCategoryId(categoryId, next) {
  if (!mongoose.Types.ObjectId.isValid(categoryId)) {
    next(new AppError(StatusCodes.BAD_REQUEST, "Valid categoryId is required"));

    return false;
  }

  return true;
}

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
  const features = new ApiFeatures(Category, req.query)
    .search(["name", "description"])
    .filterBoolean("isActive")
    .sort(["name", "createdAt", "updatedAt"], "createdAt")
    .paginate()
    .lean();

  const totalCategories = await features.count();
  const categories = await features.execute();

  return sendResponse(
    res,
    StatusCodes.OK,
    "Categories fetched successfully",
    categories,
    {
      filters: features.getFiltersMeta(),
      pagination: features.getPaginationMeta(
        totalCategories,
        "totalCategories",
      ),
      count: categories.length,
    },
  );
}

async function getCategoryById(req, res, next) {
  const { categoryId } = req.params;

  if (!validateCategoryId(categoryId, next)) {
    return;
  }

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

  const category = await Category.findById(categoryId);

  if (!category) {
    return next(new AppError(StatusCodes.NOT_FOUND, "Category not found"));
  }

  const productCount = await Product.countDocuments({
    category: categoryId,
  });

  if (productCount > 0) {
    return next(
      new AppError(
        StatusCodes.CONFLICT,
        "Cannot delete category with existing products",
        [
          `This category is used by ${productCount} product(s). Move or delete those products before deleting this category.`,
        ],
      ),
    );
  }

  if (category.image?.publicId) {
    await deleteImageFromCloudinary(category.image.publicId);
  }

  await Category.findByIdAndDelete(categoryId);

  return sendResponse(
    res,
    StatusCodes.OK,
    "Category deleted successfully",
    category,
  );
}

async function uploadCategoryImageController(req, res, next) {
  const { categoryId } = req.params;

  if (!validateCategoryId(categoryId, next)) {
    return;
  }

  if (!req.file) {
    return next(
      new AppError(StatusCodes.BAD_REQUEST, "Category image is required"),
    );
  }

  const category = await Category.findById(categoryId);

  if (!category) {
    return next(new AppError(StatusCodes.NOT_FOUND, "Category not found"));
  }

  if (category.image?.publicId) {
    await deleteImageFromCloudinary(category.image.publicId);
  }

  const uploadedImage = await uploadCategoryImageFile(req.file, category._id);

  category.image = uploadedImage;

  await category.save();

  return sendResponse(
    res,
    StatusCodes.OK,
    "Category image uploaded successfully",
    category,
  );
}

async function deleteCategoryImageController(req, res, next) {
  const { categoryId } = req.params;

  if (!validateCategoryId(categoryId, next)) {
    return;
  }

  const category = await Category.findById(categoryId);

  if (!category) {
    return next(new AppError(StatusCodes.NOT_FOUND, "Category not found"));
  }

  if (!category.image?.publicId) {
    return next(
      new AppError(StatusCodes.NOT_FOUND, "Category image not found"),
    );
  }

  await deleteImageFromCloudinary(category.image.publicId);

  category.image = {
    url: "",
    publicId: "",
    alt: "",
  };

  await category.save();

  return sendResponse(
    res,
    StatusCodes.OK,
    "Category image deleted successfully",
    category,
  );
}

export {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
  uploadCategoryImageController,
  deleteCategoryImageController,
};
