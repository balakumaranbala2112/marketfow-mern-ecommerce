import Category from "../models/category.model.js";
import Product from "../models/product.model.js";

import StatusCodes from "../constants/statusCodes.js";
import AppError from "../utils/AppError.js";
import createSlug from "../utils/createSlug.js";
import sendResponse from "../utils/sendResponse.js";

async function createProduct(req, res, next) {
  const {
    name,
    description,
    shortDescription,
    price,
    discountPrice,
    category,
    brand,
    images,
    stock,
    sku,
    isActive,
    isFeatured,
    specifications,
  } = req.body;

  const categoryExists = await Category.exists({ _id: category });

  if (!categoryExists) {
    return next(new AppError(StatusCodes.NOT_FOUND, "Category not found"));
  }

  const product = await Product.create({
    name,
    slug: createSlug(name),
    description,
    shortDescription,
    price,
    discountPrice,
    category,
    brand,
    images,
    stock,
    sku,
    isActive,
    isFeatured,
    specifications,
  });

  const populatedProduct = await Product.findById(product._id).populate(
    "category",
    "name slug",
  );

  return sendResponse(
    res,
    StatusCodes.CREATED,
    "Product created successfully",
    populatedProduct,
  );
}

export { createProduct };
