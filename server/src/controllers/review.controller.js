import mongoose from "mongoose";

import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import Review from "../models/review.model.js";

import StatusCodes from "../constants/statusCodes.js";
import AppError from "../utils/AppError.js";
import sendResponse from "../utils/sendResponse.js";

function validateObjectId(id, fieldName, next) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    next(
      new AppError(StatusCodes.BAD_REQUEST, `Valid ${fieldName} is required`),
    );

    return false;
  }

  return true;
}

async function recalculateProductRatings(productId) {
  const stats = await Review.aggregate([
    {
      $match: {
        product: new mongoose.Types.ObjectId(productId),
        isApproved: true,
      },
    },
    {
      $group: {
        _id: "$product",
        ratingsAverage: {
          $avg: "$rating",
        },
        ratingsCount: {
          $sum: 1,
        },
      },
    },
  ]);

  if (stats.length === 0) {
    await Product.findByIdAndUpdate(productId, {
      ratingsAverage: 0,
      ratingsCount: 0,
    });

    return;
  }

  await Product.findByIdAndUpdate(productId, {
    ratingsAverage: Math.round(stats[0].ratingsAverage * 10) / 10,
    ratingsCount: stats[0].ratingsCount,
  });
}

async function checkUserPurchasedDeliveredProduct(userId, productId) {
  return Order.exists({
    user: userId,
    orderStatus: "delivered",
    "orderItems.product": productId,
  });
}

async function getProductReviews(req, res, next) {
  const { productId } = req.params;

  if (!validateObjectId(productId, "productId", next)) {
    return;
  }

  const productExists = await Product.exists({ _id: productId });

  if (!productExists) {
    return next(new AppError(StatusCodes.NOT_FOUND, "Product not found"));
  }

  const reviews = await Review.find({
    product: productId,
    isApproved: true,
  })
    .sort({ createdAt: -1 })
    .populate("user", "name avatar")
    .lean();

  return sendResponse(
    res,
    StatusCodes.OK,
    "Product reviews fetched successfully",
    reviews,
    {
      count: reviews.length,
    },
  );
}

async function createProductReview(req, res, next) {
  const { productId } = req.params;
  const { rating, comment } = req.body;

  if (!validateObjectId(productId, "productId", next)) {
    return;
  }

  const product = await Product.findById(productId);

  if (!product) {
    return next(new AppError(StatusCodes.NOT_FOUND, "Product not found"));
  }

  if (!product.isActive) {
    return next(
      new AppError(
        StatusCodes.BAD_REQUEST,
        "Product is currently not available for review",
      ),
    );
  }

  const hasDeliveredOrder = await checkUserPurchasedDeliveredProduct(
    req.user._id,
    productId,
  );

  if (!hasDeliveredOrder) {
    return next(
      new AppError(
        StatusCodes.FORBIDDEN,
        "You can review only delivered products you purchased",
      ),
    );
  }

  const existingReview = await Review.findOne({
    user: req.user._id,
    product: productId,
  });

  if (existingReview) {
    return next(
      new AppError(
        StatusCodes.CONFLICT,
        "You have already reviewed this product",
      ),
    );
  }

  const review = await Review.create({
    user: req.user._id,
    product: productId,
    rating,
    comment: comment.trim(),
  });

  await recalculateProductRatings(productId);

  const populatedReview = await Review.findById(review._id)
    .populate("user", "name avatar")
    .populate("product", "name slug ratingsAverage ratingsCount");

  return sendResponse(
    res,
    StatusCodes.CREATED,
    "Review created successfully",
    populatedReview,
  );
}

async function updateMyProductReview(req, res, next) {
  const { productId, reviewId } = req.params;
  const { rating, comment } = req.body;

  if (!validateObjectId(productId, "productId", next)) {
    return;
  }

  if (!validateObjectId(reviewId, "reviewId", next)) {
    return;
  }

  const review = await Review.findOne({
    _id: reviewId,
    product: productId,
    user: req.user._id,
  });

  if (!review) {
    return next(new AppError(StatusCodes.NOT_FOUND, "Review not found"));
  }

  if (rating !== undefined) {
    review.rating = rating;
  }

  if (comment !== undefined) {
    review.comment = comment.trim();
  }

  await review.save();

  await recalculateProductRatings(productId);

  const populatedReview = await Review.findById(review._id)
    .populate("user", "name avatar")
    .populate("product", "name slug ratingsAverage ratingsCount");

  return sendResponse(
    res,
    StatusCodes.OK,
    "Review updated successfully",
    populatedReview,
  );
}

async function deleteMyProductReview(req, res, next) {
  const { productId, reviewId } = req.params;

  if (!validateObjectId(productId, "productId", next)) {
    return;
  }

  if (!validateObjectId(reviewId, "reviewId", next)) {
    return;
  }

  const review = await Review.findOne({
    _id: reviewId,
    product: productId,
    user: req.user._id,
  });

  if (!review) {
    return next(new AppError(StatusCodes.NOT_FOUND, "Review not found"));
  }

  await Review.deleteOne({ _id: review._id });

  await recalculateProductRatings(productId);

  return sendResponse(
    res,
    StatusCodes.OK,
    "Review deleted successfully",
    review,
  );
}

export {
  getProductReviews,
  createProductReview,
  updateMyProductReview,
  deleteMyProductReview,
};
