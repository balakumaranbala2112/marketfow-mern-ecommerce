import mongoose from "mongoose";

import Cart from "../models/cart.model.js";
import Order from "../models/order.model.js";
import Product from "../models/product.model.js";

import StatusCodes from "../constants/statusCodes.js";
import AppError from "../utils/AppError.js";
import calculateCartTotals from "../utils/calculateCartTotals.js";
import sendResponse from "../utils/sendResponse.js";

function getProductPrice(product) {
  return product.discountPrice ?? product.price;
}

function getProductImage(product) {
  return product.images?.[0]?.url || "";
}

function calculateShippingPrice(itemsPrice) {
  return itemsPrice >= 5000 ? 0 : 50;
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

function validateOrderId(orderId, next) {
  if (!mongoose.Types.ObjectId.isValid(orderId)) {
    next(new AppError(StatusCodes.BAD_REQUEST, "Valid orderId is required"));

    return false;
  }

  return true;
}

async function createOrderFromCart(req, res, next) {
  const { shippingAddress, paymentMethod } = req.body;

  const cart = await Cart.findOne({ user: req.user._id });

  if (!cart || cart.items.length === 0) {
    return next(
      new AppError(StatusCodes.BAD_REQUEST, "Cart is empty", [
        "Add products to cart before creating an order",
      ]),
    );
  }

  const orderItems = [];
  const productsToUpdate = [];

  let itemsPrice = 0;

  for (const cartItem of cart.items) {
    const product = await Product.findById(cartItem.product);

    if (!product) {
      return next(
        new AppError(
          StatusCodes.NOT_FOUND,
          `Product not found for cart item: ${cartItem.name}`,
        ),
      );
    }

    if (!product.isActive) {
      return next(
        new AppError(
          StatusCodes.BAD_REQUEST,
          `${product.name} is currently not available`,
        ),
      );
    }

    if (product.stock < cartItem.quantity) {
      return next(
        new AppError(StatusCodes.BAD_REQUEST, "Insufficient product stock", [
          `${product.name} has only ${product.stock} item(s) available`,
        ]),
      );
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

  const shippingPrice = calculateShippingPrice(itemsPrice);
  const taxPrice = 0;
  const discountPrice = 0;
  const totalPrice = itemsPrice + shippingPrice + taxPrice - discountPrice;

  const order = await Order.create({
    user: req.user._id,
    orderItems,
    shippingAddress: normalizeShippingAddress(shippingAddress),
    paymentMethod,
    paymentStatus: "pending",
    orderStatus: "pending",
    itemsPrice,
    shippingPrice,
    taxPrice,
    discountPrice,
    totalPrice,
  });

  for (const item of productsToUpdate) {
    item.product.stock -= item.quantity;
    await item.product.save({ validateBeforeSave: false });
  }

  cart.items = [];
  calculateCartTotals(cart);
  await cart.save();

  const populatedOrder = await Order.findById(order._id)
    .populate("user", "name email")
    .populate("orderItems.product", "name slug");

  return sendResponse(
    res,
    StatusCodes.CREATED,
    "Order created successfully",
    populatedOrder,
  );
}

async function getMyOrders(req, res) {
  const orders = await Order.find({ user: req.user._id })
    .sort({ createdAt: -1 })
    .populate("orderItems.product", "name slug")
    .lean();

  return sendResponse(
    res,
    StatusCodes.OK,
    "Orders fetched successfully",
    orders,
    {
      count: orders.length,
    },
  );
}

async function getMyOrderById(req, res, next) {
  const { orderId } = req.params;

  if (!validateOrderId(orderId, next)) {
    return;
  }

  const order = await Order.findOne({
    _id: orderId,
    user: req.user._id,
  })
    .populate("user", "name email")
    .populate("orderItems.product", "name slug");

  if (!order) {
    return next(new AppError(StatusCodes.NOT_FOUND, "Order not found"));
  }

  return sendResponse(res, StatusCodes.OK, "Order fetched successfully", order);
}

export { createOrderFromCart, getMyOrders, getMyOrderById };
