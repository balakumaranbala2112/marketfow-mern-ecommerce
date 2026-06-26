import mongoose from "mongoose";

import Product from "../models/product.model.js";
import Wishlist from "../models/wishlist.model.js";

import StatusCodes from "../constants/statusCodes.js";
import AppError from "../utils/AppError.js";
import sendResponse from "../utils/sendResponse.js";

async function getOrCreateWishlist(userId) {
  let wishlist = await Wishlist.findOne({ user: userId });

  if (!wishlist) {
    wishlist = await Wishlist.create({
      user: userId,
      products: [],
    });
  }

  return wishlist;
}

async function getPopulatedWishlist(wishlistId) {
  return Wishlist.findById(wishlistId).populate(
    "products",
    "name slug price discountPrice images stock ratingsAverage ratingsCount isActive",
  );
}

function validateProductId(productId, next) {
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    next(new AppError(StatusCodes.BAD_REQUEST, "Valid productId is required"));

    return false;
  }

  return true;
}

async function getMyWishlist(req, res) {
  const wishlist = await getOrCreateWishlist(req.user._id);
  const populatedWishlist = await getPopulatedWishlist(wishlist._id);

  return sendResponse(
    res,
    StatusCodes.OK,
    "Wishlist fetched successfully",
    populatedWishlist,
  );
}

async function addToWishlist(req, res, next) {
  const { productId } = req.body;

  const product = await Product.findById(productId);

  if (!product) {
    return next(new AppError(StatusCodes.NOT_FOUND, "Product not found"));
  }

  if (!product.isActive) {
    return next(
      new AppError(
        StatusCodes.BAD_REQUEST,
        "Product is currently not available",
      ),
    );
  }

  const wishlist = await getOrCreateWishlist(req.user._id);

  const alreadyExists = wishlist.products.some((productObjectId) => {
    return productObjectId.toString() === productId;
  });

  if (alreadyExists) {
    return next(
      new AppError(StatusCodes.CONFLICT, "Product already exists in wishlist"),
    );
  }

  wishlist.products.push(product._id);

  await wishlist.save();

  const populatedWishlist = await getPopulatedWishlist(wishlist._id);

  return sendResponse(
    res,
    StatusCodes.OK,
    "Product added to wishlist successfully",
    populatedWishlist,
  );
}

async function removeFromWishlist(req, res, next) {
  const { productId } = req.params;

  if (!validateProductId(productId, next)) {
    return;
  }

  const wishlist = await getOrCreateWishlist(req.user._id);

  const productExistsInWishlist = wishlist.products.some((productObjectId) => {
    return productObjectId.toString() === productId;
  });

  if (!productExistsInWishlist) {
    return next(
      new AppError(StatusCodes.NOT_FOUND, "Product not found in wishlist"),
    );
  }

  wishlist.products = wishlist.products.filter((productObjectId) => {
    return productObjectId.toString() !== productId;
  });

  await wishlist.save();

  const populatedWishlist = await getPopulatedWishlist(wishlist._id);

  return sendResponse(
    res,
    StatusCodes.OK,
    "Product removed from wishlist successfully",
    populatedWishlist,
  );
}

export { getMyWishlist, addToWishlist, removeFromWishlist };
