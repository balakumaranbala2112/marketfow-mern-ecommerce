import Cart from "../models/cart.model.js";
import Coupon from "../models/coupon.model.js";

import StatusCodes from "../constants/statusCodes.js";
import AppError from "../utils/AppError.js";
import calculateCartTotals from "../utils/calculateCartTotals.js";
import sendResponse from "../utils/sendResponse.js";

function normalizeCouponCode(code) {
  return code.trim().toUpperCase();
}

function isCouponStarted(coupon) {
  return !coupon.startsAt || coupon.startsAt <= new Date();
}

function isCouponExpired(coupon) {
  return coupon.expiresAt && coupon.expiresAt < new Date();
}

function isCouponUsageLimitReached(coupon) {
  return coupon.usageLimit !== null && coupon.usedCount >= coupon.usageLimit;
}

async function getOrCreateCart(userId) {
  let cart = await Cart.findOne({ user: userId });

  if (!cart) {
    cart = await Cart.create({
      user: userId,
      items: [],
    });
  }

  return cart;
}

async function getPopulatedCart(cartId) {
  return Cart.findById(cartId).populate(
    "items.product",
    "name slug price discountPrice stock isActive",
  );
}

function validateCouponForCart(coupon, cartTotal, next) {
  if (!coupon.isActive) {
    next(new AppError(StatusCodes.BAD_REQUEST, "Coupon is not active"));

    return false;
  }

  if (!isCouponStarted(coupon)) {
    next(new AppError(StatusCodes.BAD_REQUEST, "Coupon is not active yet"));

    return false;
  }

  if (isCouponExpired(coupon)) {
    next(new AppError(StatusCodes.BAD_REQUEST, "Coupon has expired"));

    return false;
  }

  if (isCouponUsageLimitReached(coupon)) {
    next(new AppError(StatusCodes.BAD_REQUEST, "Coupon usage limit reached"));

    return false;
  }

  if (cartTotal < coupon.minOrderAmount) {
    next(
      new AppError(
        StatusCodes.BAD_REQUEST,
        "Cart total is below coupon minimum order amount",
        [`Minimum order amount is ${coupon.minOrderAmount}`],
      ),
    );

    return false;
  }

  return true;
}

async function createCouponForAdmin(req, res) {
  const {
    code,
    description,
    discountType,
    discountValue,
    minOrderAmount,
    maxDiscountAmount,
    usageLimit,
    startsAt,
    expiresAt,
    isActive,
  } = req.body;

  const coupon = await Coupon.create({
    code: normalizeCouponCode(code),
    description,
    discountType,
    discountValue,
    minOrderAmount,
    maxDiscountAmount,
    usageLimit,
    startsAt,
    expiresAt,
    isActive,
    createdBy: req.user._id,
  });

  return sendResponse(
    res,
    StatusCodes.CREATED,
    "Coupon created successfully",
    coupon,
  );
}

async function getAllCouponsForAdmin(req, res) {
  const coupons = await Coupon.find()
    .sort({ createdAt: -1 })
    .populate("createdBy", "name email")
    .lean();

  return sendResponse(
    res,
    StatusCodes.OK,
    "Coupons fetched successfully",
    coupons,
    {
      count: coupons.length,
    },
  );
}

async function applyCouponToCart(req, res, next) {
  const { code } = req.body;

  const normalizedCode = normalizeCouponCode(code);

  const coupon = await Coupon.findOne({ code: normalizedCode });

  if (!coupon) {
    return next(new AppError(StatusCodes.NOT_FOUND, "Coupon not found"));
  }

  const cart = await getOrCreateCart(req.user._id);

  if (cart.items.length === 0) {
    return next(
      new AppError(StatusCodes.BAD_REQUEST, "Cart is empty", [
        "Add products to cart before applying coupon",
      ]),
    );
  }

  calculateCartTotals(cart);

  if (cart.coupon && cart.coupon.code === normalizedCode) {
    return next(
      new AppError(StatusCodes.CONFLICT, "Coupon already applied to cart"),
    );
  }

  if (!validateCouponForCart(coupon, cart.cartTotal, next)) {
    return;
  }

  cart.coupon = {
    coupon: coupon._id,
    code: coupon.code,
    discountType: coupon.discountType,
    discountValue: coupon.discountValue,
    minOrderAmount: coupon.minOrderAmount,
    maxDiscountAmount: coupon.maxDiscountAmount,
    discountAmount: 0,
  };

  calculateCartTotals(cart);

  await cart.save();

  const populatedCart = await getPopulatedCart(cart._id);

  return sendResponse(
    res,
    StatusCodes.OK,
    "Coupon applied successfully",
    populatedCart,
  );
}

async function removeCouponFromCart(req, res, next) {
  const cart = await getOrCreateCart(req.user._id);

  if (!cart.coupon) {
    return next(
      new AppError(StatusCodes.BAD_REQUEST, "No coupon applied to cart"),
    );
  }

  cart.coupon = null;

  calculateCartTotals(cart);

  await cart.save();

  const populatedCart = await getPopulatedCart(cart._id);

  return sendResponse(
    res,
    StatusCodes.OK,
    "Coupon removed successfully",
    populatedCart,
  );
}

export {
  createCouponForAdmin,
  getAllCouponsForAdmin,
  applyCouponToCart,
  removeCouponFromCart,
};
