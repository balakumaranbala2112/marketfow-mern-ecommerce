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

async function getAllProducts(req, res) {
  const products = await Product.find()
    .populate("category", "name slug")
    .sort({ createdAt: -1 });

  return sendResponse(
    res,
    StatusCodes.OK,
    "Products fetched successfully",
    products,
    {
      count: products.length,
    },
  );
}

async function getProductById(req, res, next) {
  const { productId } = req.params;

  const product = await Product.findById(productId).populate(
    "category",
    "name slug description",
  );

  if (!product) {
    return next(new AppError(StatusCodes.NOT_FOUND, "Product not found"));
  }

  return sendResponse(
    res,
    StatusCodes.OK,
    "Product fetched successfully",
    product,
  );
}

export { createProduct, getAllProducts, getProductById };
