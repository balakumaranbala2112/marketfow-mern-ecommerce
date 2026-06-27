import mongoose from "mongoose";

import createRazorpayInstance from "../config/razorpay.js";
import env from "../config/env.js";

import Cart from "../models/cart.model.js";
import Coupon from "../models/coupon.model.js";
import Order from "../models/order.model.js";
import Product from "../models/product.model.js";

import Roles from "../constants/roles.js";
import StatusCodes from "../constants/statusCodes.js";
import AppError from "../utils/AppError.js";
import calculateCartTotals from "../utils/calculateCartTotals.js";
import sendResponse from "../utils/sendResponse.js";

import {
  convertRupeesToPaise,
  verifyRazorpaySignature,
} from "../utils/razorpay.js";

const ONLINE_PAYMENT_EXPIRY_MINUTES = 30;

function ensureRazorpayConfigured(next) {
  if (!env.payment.razorpay.keyId || !env.payment.razorpay.keySecret) {
    next(
      new AppError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        "Razorpay is not configured",
      ),
    );

    return false;
  }

  return true;
}

function validateOrderId(orderId, next) {
  if (!mongoose.Types.ObjectId.isValid(orderId)) {
    next(new AppError(StatusCodes.BAD_REQUEST, "Valid orderId is required"));

    return false;
  }

  return true;
}

function getProductPrice(product) {
  return product.discountPrice ?? product.price;
}

function getProductImage(product) {
  return product.images?.[0]?.url || "";
}

function calculateShippingPrice(itemsPrice) {
  return itemsPrice >= 5000 ? 0 : 50;
}

function getPaymentExpiryDate() {
  return new Date(Date.now() + ONLINE_PAYMENT_EXPIRY_MINUTES * 60 * 1000);
}

function normalizeShippingAddress(shippingAddress) {
  return {
    fullName: shippingAddress.fullName.trim(),
    phone: shippingAddress.phone.trim(),
    addressLine1: shippingAddress.addressLine1.trim(),
    addressLine2: shippingAddress.addressLine2?.trim() || "",
    city: shippingAddress.city.trim(),
    state: shippingAddress.state.trim(),
    postalCode: shippingAddress.postalCode.trim(),
    country: shippingAddress.country.trim(),
  };
}

async function populateOrder(orderId) {
  return Order.findById(orderId)
    .populate("user", "name email phone")
    .populate("orderItems.product", "name slug");
}

async function buildOrderItemsFromCart(cart, next) {
  const orderItems = [];
  const productsToUpdate = [];

  let itemsPrice = 0;

  for (const cartItem of cart.items) {
    const product = await Product.findById(cartItem.product);

    if (!product) {
      next(
        new AppError(
          StatusCodes.NOT_FOUND,
          `Product not found for cart item: ${cartItem.name}`,
        ),
      );

      return null;
    }

    if (!product.isActive) {
      next(
        new AppError(
          StatusCodes.BAD_REQUEST,
          `${product.name} is currently not available`,
        ),
      );

      return null;
    }

    if (product.stock < cartItem.quantity) {
      next(
        new AppError(StatusCodes.BAD_REQUEST, "Insufficient product stock", [
          `${product.name} has only ${product.stock} item(s) available`,
        ]),
      );

      return null;
    }

    const latestPrice = getProductPrice(product);
    const subtotal = latestPrice * cartItem.quantity;

    orderItems.push({
      product: product._id,
      name: product.name,
      image: getProductImage(product),
      price: latestPrice,
      quantity: cartItem.quantity,
      subtotal,
    });

    productsToUpdate.push({
      product,
      quantity: cartItem.quantity,
    });

    itemsPrice += subtotal;
  }

  return {
    orderItems,
    productsToUpdate,
    itemsPrice,
  };
}

function buildAppliedCoupon(cart) {
  if (!cart.coupon) {
    return null;
  }

  return {
    coupon: cart.coupon.coupon,
    code: cart.coupon.code,
    discountType: cart.coupon.discountType,
    discountValue: cart.coupon.discountValue,
    discountAmount: cart.discountPrice || 0,
  };
}

async function reduceProductStock(productsToUpdate) {
  for (const item of productsToUpdate) {
    item.product.stock -= item.quantity;
    await item.product.save({ validateBeforeSave: false });
  }
}

async function restoreOrderProductStock(order) {
  if (order.stockRestoredAt) {
    return false;
  }

  for (const item of order.orderItems) {
    const product = await Product.findById(item.product);

    if (product) {
      product.stock += item.quantity;
      await product.save({ validateBeforeSave: false });
    }
  }

  order.stockRestoredAt = new Date();

  return true;
}

async function clearCart(cart) {
  cart.items = [];
  cart.coupon = null;
  calculateCartTotals(cart);
  await cart.save();
}

async function createRazorpayProviderOrder({ amount, receipt }) {
  const razorpay = createRazorpayInstance();

  return razorpay.orders.create({
    amount: convertRupeesToPaise(amount),
    currency: env.payment.razorpay.currency,
    receipt,
  });
}

async function createRazorpayOrderFromCart(req, res, next) {
  if (!ensureRazorpayConfigured(next)) {
    return;
  }

  const { shippingAddress } = req.body;

  const cart = await Cart.findOne({ user: req.user._id });

  if (!cart || cart.items.length === 0) {
    return next(
      new AppError(StatusCodes.BAD_REQUEST, "Cart is empty", [
        "Add products to cart before creating Razorpay order",
      ]),
    );
  }

  calculateCartTotals(cart);

  const cartBuildResult = await buildOrderItemsFromCart(cart, next);

  if (!cartBuildResult) {
    return;
  }

  const { orderItems, productsToUpdate, itemsPrice } = cartBuildResult;

  const shippingPrice = calculateShippingPrice(itemsPrice);
  const taxPrice = 0;
  const discountPrice = cart.discountPrice || 0;
  const totalPrice = itemsPrice + shippingPrice + taxPrice - discountPrice;

  if (totalPrice <= 0) {
    return next(
      new AppError(
        StatusCodes.BAD_REQUEST,
        "Order total must be greater than zero",
      ),
    );
  }

  const receipt = `mf_${Date.now()}`;

  const razorpayOrder = await createRazorpayProviderOrder({
    amount: totalPrice,
    receipt,
  });

  const order = await Order.create({
    user: req.user._id,
    orderItems,
    shippingAddress: normalizeShippingAddress(shippingAddress),
    paymentMethod: "online",
    paymentInfo: {
      provider: "razorpay",
      providerOrderId: razorpayOrder.id,
      providerStatus: razorpayOrder.status,
      receipt,
      rawResponse: razorpayOrder,
    },
    paymentStatus: "pending",
    paymentFailureReason: "",
    paymentRetryCount: 0,
    paymentExpiresAt: getPaymentExpiryDate(),
    orderStatus: "pending",
    itemsPrice,
    shippingPrice,
    taxPrice,
    discountPrice,
    coupon: buildAppliedCoupon(cart),
    totalPrice,
  });

  await reduceProductStock(productsToUpdate);

  await clearCart(cart);

  const populatedOrder = await populateOrder(order._id);

  return sendResponse(
    res,
    StatusCodes.CREATED,
    "Razorpay order created successfully",
    {
      order: populatedOrder,
      razorpay: {
        keyId: env.payment.razorpay.keyId,
        orderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
      },
    },
  );
}

async function verifyRazorpayPayment(req, res, next) {
  if (!ensureRazorpayConfigured(next)) {
    return;
  }

  const {
    orderId,
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
  } = req.body;

  if (!validateOrderId(orderId, next)) {
    return;
  }

  const order = await Order.findOne({
    _id: orderId,
    user: req.user._id,
  });

  if (!order) {
    return next(new AppError(StatusCodes.NOT_FOUND, "Order not found"));
  }

  if (order.paymentMethod !== "online") {
    return next(
      new AppError(
        StatusCodes.BAD_REQUEST,
        "This order is not an online payment order",
      ),
    );
  }

  if (order.paymentInfo.provider !== "razorpay") {
    return next(
      new AppError(
        StatusCodes.BAD_REQUEST,
        "This order is not linked with Razorpay",
      ),
    );
  }

  if (order.paymentStatus === "paid") {
    return next(
      new AppError(
        StatusCodes.BAD_REQUEST,
        "Order payment is already verified",
      ),
    );
  }

  if (order.orderStatus === "cancelled") {
    return next(
      new AppError(
        StatusCodes.BAD_REQUEST,
        "Cancelled order cannot be verified",
      ),
    );
  }

  if (order.paymentInfo.providerOrderId !== razorpay_order_id) {
    return next(
      new AppError(
        StatusCodes.BAD_REQUEST,
        "Razorpay order id does not match local order",
      ),
    );
  }

  const isValidSignature = verifyRazorpaySignature({
    razorpayOrderId: order.paymentInfo.providerOrderId,
    razorpayPaymentId: razorpay_payment_id,
    razorpaySignature: razorpay_signature,
  });

  if (!isValidSignature) {
    order.paymentStatus = "failed";
    order.paymentFailureReason = "Invalid Razorpay payment signature";
    order.paymentInfo.providerStatus = "signature_verification_failed";

    await order.save({ validateBeforeSave: false });

    return next(
      new AppError(
        StatusCodes.BAD_REQUEST,
        "Invalid Razorpay payment signature",
      ),
    );
  }

  order.paymentStatus = "paid";
  order.paymentFailureReason = "";
  order.paidAt = new Date();
  order.paymentExpiresAt = null;
  order.orderStatus =
    order.orderStatus === "pending" ? "confirmed" : order.orderStatus;

  order.paymentInfo.providerPaymentId = razorpay_payment_id;
  order.paymentInfo.providerSignature = razorpay_signature;
  order.paymentInfo.providerStatus = "verified";

  await order.save({ validateBeforeSave: false });

  if (order.coupon?.coupon) {
    await Coupon.findByIdAndUpdate(order.coupon.coupon, {
      $inc: {
        usedCount: 1,
      },
    });
  }

  const populatedOrder = await populateOrder(order._id);

  return sendResponse(
    res,
    StatusCodes.OK,
    "Razorpay payment verified successfully",
    {
      order: populatedOrder,
    },
  );
}

async function markRazorpayPaymentFailed(req, res, next) {
  const { orderId, razorpay_order_id, razorpay_payment_id, reason } = req.body;

  if (!validateOrderId(orderId, next)) {
    return;
  }

  const order = await Order.findOne({
    _id: orderId,
    user: req.user._id,
  });

  if (!order) {
    return next(new AppError(StatusCodes.NOT_FOUND, "Order not found"));
  }

  if (order.paymentMethod !== "online") {
    return next(
      new AppError( 
        StatusCodes.BAD_REQUEST,
        "This order is not an online payment order",
      ),
    );
  }

  if (order.paymentStatus === "paid") {
    return next(
      new AppError(
        StatusCodes.BAD_REQUEST,
        "Paid order cannot be marked as failed",
      ),
    );
  }

  if (order.orderStatus === "cancelled") {
    return next(
      new AppError(
        StatusCodes.BAD_REQUEST,
        "Cancelled order cannot be marked as failed",
      ),
    );
  }

  if (order.paymentInfo.providerOrderId !== razorpay_order_id) {
    return next(
      new AppError(
        StatusCodes.BAD_REQUEST,
        "Razorpay order id does not match local order",
      ),
    );
  }

  order.paymentStatus = "failed";
  order.paymentFailureReason =
    reason?.trim() || "Razorpay payment failed or was cancelled by user";
  order.paymentInfo.providerStatus = "failed";

  if (razorpay_payment_id) {
    order.paymentInfo.providerPaymentId = razorpay_payment_id;
  }

  await order.save({ validateBeforeSave: false });

  const populatedOrder = await populateOrder(order._id);

  return sendResponse(
    res,
    StatusCodes.OK,
    "Razorpay payment marked as failed",
    {
      order: populatedOrder,
    },
  );
}

async function retryRazorpayPayment(req, res, next) {
  if (!ensureRazorpayConfigured(next)) {
    return;
  }

  const { orderId } = req.params;

  if (!validateOrderId(orderId, next)) {
    return;
  }

  const order = await Order.findOne({
    _id: orderId,
    user: req.user._id,
  });

  if (!order) {
    return next(new AppError(StatusCodes.NOT_FOUND, "Order not found"));
  }

  if (order.paymentMethod !== "online") {
    return next(
      new AppError(
        StatusCodes.BAD_REQUEST,
        "Only online payment orders can be retried",
      ),
    );
  }

  if (order.paymentStatus === "paid") {
    return next(
      new AppError(StatusCodes.BAD_REQUEST, "Paid order cannot be retried"),
    );
  }

  if (order.orderStatus === "cancelled") {
    return next(
      new AppError(
        StatusCodes.BAD_REQUEST,
        "Cancelled order cannot be retried",
      ),
    );
  }

  if (order.stockRestoredAt) {
    return next(
      new AppError(
        StatusCodes.BAD_REQUEST,
        "Order stock was already restored. Create a new order instead.",
      ),
    );
  }

  const receipt = `mf_retry_${Date.now()}`;

  const razorpayOrder = await createRazorpayProviderOrder({
    amount: order.totalPrice,
    receipt,
  });

  order.paymentStatus = "pending";
  order.paymentFailureReason = "";
  order.paymentRetryCount += 1;
  order.paymentExpiresAt = getPaymentExpiryDate();

  order.paymentInfo.provider = "razorpay";
  order.paymentInfo.providerOrderId = razorpayOrder.id;
  order.paymentInfo.providerPaymentId = "";
  order.paymentInfo.providerSignature = "";
  order.paymentInfo.providerStatus = razorpayOrder.status;
  order.paymentInfo.receipt = receipt;
  order.paymentInfo.rawResponse = razorpayOrder;

  await order.save({ validateBeforeSave: false });

  const populatedOrder = await populateOrder(order._id);

  return sendResponse(
    res,
    StatusCodes.OK,
    "Razorpay payment retry created successfully",
    {
      order: populatedOrder,
      razorpay: {
        keyId: env.payment.razorpay.keyId,
        orderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
      },
    },
  );
}

async function cleanupPendingOnlineOrders(req, res) {
  const expiryDate = new Date(
    Date.now() - ONLINE_PAYMENT_EXPIRY_MINUTES * 60 * 1000,
  );

  const expiredOrders = await Order.find({
    paymentMethod: "online",
    paymentStatus: {
      $in: ["pending", "failed"],
    },
    orderStatus: "pending",
    stockRestoredAt: null,
    $or: [
      {
        paymentExpiresAt: {
          $lte: new Date(),
        },
      },
      {
        createdAt: {
          $lte: expiryDate,
        },
      },
    ],
  });

  const cleanedOrders = [];

  for (const order of expiredOrders) {
    await restoreOrderProductStock(order);

    order.paymentStatus = "failed";
    order.paymentFailureReason =
      order.paymentFailureReason ||
      "Payment expired before successful verification";
    order.orderStatus = "cancelled";
    order.cancelledAt = new Date();
    order.paymentInfo.providerStatus = "expired_cleanup";

    await order.save({ validateBeforeSave: false });

    cleanedOrders.push(order._id);
  }

  return sendResponse(
    res,
    StatusCodes.OK,
    "Pending online payment orders cleaned successfully",
    {
      cleanedCount: cleanedOrders.length,
      cleanedOrderIds: cleanedOrders,
    },
  );
}

export {
  createRazorpayOrderFromCart,
  verifyRazorpayPayment,
  markRazorpayPaymentFailed,
  retryRazorpayPayment,
  cleanupPendingOnlineOrders,
};
