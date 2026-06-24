import Category from "../models/category.model.js";
import Product from "../models/product.model.js";

import StatusCodes from "../constants/statusCodes.js";
import AppError from "../utils/AppError.js";
import createSlug from "../utils/createSlug.js";
import removeUndefinedFields from "../utils/removeUndefinedFields.js";
import sendResponse from "../utils/sendResponse.js";
import ApiFeatures from "../utils/ApiFeatures.js";

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
  const features = new ApiFeatures(Product, req.query)
    .search(["name", "description", "brand"])
    .filterExact("category")
    .filterExact("brand")
    .filterBoolean("isActive")
    .filterBoolean("isFeatured")
    .filterNumberRange("price", "minPrice", "maxPrice")
    .sort(
      ["name", "price", "ratingsAverage", "stock", "createdAt", "updatedAt"],
      "createdAt",
    )
    .paginate()
    .populate("category", "name slug")
    .lean();

  const totalProducts = await features.count;
  const products = await features.execute();

  return sendResponse(
    res,
    StatusCodes.OK,
    "Products fetched successfully",
    products,
    {
      filters: features.getFiltersMeta(),
      pagination: features.getPaginationMeta(totalProducts, "totalProducts"),
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

async function updateProduct(req, res, next) {
  const { productId } = req.params;

  const existingProduct = await Product.findById(productId);

  if (!existingProduct) {
    return next(new AppError(StatusCodes.NOT_FOUND, "Product not found"));
  }

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

  if (category !== undefined) {
    const categoryExists = await Category.exists({ _id: category });

    if (!categoryExists) {
      return next(new AppError(StatusCodes.NOT_FOUND, "Category not found"));
    }
  }

  let updateData = {
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
  };

  // Keep slug synced with name changes.
  if (name !== undefined) {
    updateData.name = name;
    updateData.slug = createSlug(name);
  }

  updateData = removeUndefinedFields(updateData);

  const finalPrice =
    updateData.price !== undefined ? updateData.price : existingProduct.price;

  const finalDiscountPrice =
    updateData.discountPrice !== undefined
      ? updateData.discountPrice
      : existingProduct.discountPrice;

  if (
    finalDiscountPrice !== null &&
    finalDiscountPrice !== undefined &&
    finalDiscountPrice >= finalPrice
  ) {
    return next(
      new AppError(StatusCodes.BAD_REQUEST, "Validation failed", [
        "Product discountPrice must be less than product price",
      ]),
    );
  }

  const product = await Product.findByIdAndUpdate(productId, updateData, {
    new: true,
    runValidators: true,
  }).populate("category", "name slug");

  return sendResponse(
    res,
    StatusCodes.OK,
    "Product updated successfully",
    product,
  );
}

async function deleteProduct(req, res, next) {
  const { productId } = req.params;

  const product = await Product.findByIdAndDelete(productId).populate(
    "category",
    "name slug",
  );

  if (!product) {
    return next(new AppError(StatusCodes.NOT_FOUND, "Product not found"));
  }

  return sendResponse(
    res,
    StatusCodes.OK,
    "Product deleted successfully",
    product,
  );
}

export {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
