import mongoose from "mongoose";

import Cart from "../models/cart.model.js";
import Order from "../models/order.model.js";
import Product from "../models/product.model.js";

import StatusCodes from "../constants/statusCodes.js";
import AppError from "../utils/AppError.js";
import calculateCartTotals from "../utils/calculateCartTotals.js";
import sendResponse from "../utils/sendResponse.js";

import {
  sendOrderConfirmationEmail,
  sendOrderStatusUpdateEmail,
} from "../services/email.service.js";

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

async function populateOrder(query) {
  return query
    .populate("user", "name email phone")
    .populate("orderItems.product", "name slug");
}

async function restoreOrderProductStock(order) {
  for (const item of order.orderItems) {
    const product = await Product.findById(item.product);

    if (product) {
      product.stock += item.quantity;
      await product.save({ validateBeforeSave: false });
    }
  }
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
    paymentInfo: {
      provider: paymentMethod === "cod" ? "cod" : "",
      providerStatus: paymentMethod === "cod" ? "pending" : "",
    },
    paymentStatus: "pending",
    orderStatus: "pending",
    itemsPrice,
    shippingPrice,
    taxPrice,
    discountPrice,
    coupon: appliedCoupon,
    totalPrice,
  });

  for (const item of productsToUpdate) {
    item.product.stock -= item.quantity;
    await item.product.save({ validateBeforeSave: false });
  }

  cart.items = [];
  calculateCartTotals(cart);
  await cart.save();

  const populatedOrder = await populateOrder(Order.findById(order._id));

  await sendOrderConfirmationEmail(populateOrder);

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

  const order = await populateOrder(
    Order.findOne({
      _id: orderId,
      user: req.user._id,
    }),
  );

  if (!order) {
    return next(new AppError(StatusCodes.NOT_FOUND, "Order not found"));
  }

  return sendResponse(res, StatusCodes.OK, "Order fetched successfully", order);
}

async function getAllOrdersForAdmin(req, res) {
  const orders = await Order.find()
    .sort({ createdAt: -1 })
    .populate("user", "name email phone")
    .populate("orderItems.product", "name slug")
    .lean();

  return sendResponse(
    res,
    StatusCodes.OK,
    "All orders fetched successfully",
    orders,
    {
      count: orders.length,
    },
  );
}

async function getOrderByIdForAdmin(req, res, next) {
  const { orderId } = req.params;

  if (!validateOrderId(orderId, next)) {
    return;
  }

  const order = await populateOrder(Order.findById(orderId));

  if (!order) {
    return next(new AppError(StatusCodes.NOT_FOUND, "Order not found"));
  }

  return sendResponse(res, StatusCodes.OK, "Order fetched successfully", order);
}

async function updateOrderStatusForAdmin(req, res, next) {
  const { orderId } = req.params;
  const { orderStatus } = req.body;

  if (!validateOrderId(orderId, next)) {
    return;
  }

  const order = await Order.findById(orderId);

  if (!order) {
    return next(new AppError(StatusCodes.NOT_FOUND, "Order not found"));
  }

  const previousOrderStatus = order.orderStatus;

  if (order.orderStatus === "delivered" && orderStatus !== "delivered") {
    return next(
      new AppError(
        StatusCodes.BAD_REQUEST,
        "Delivered order status cannot be changed",
      ),
    );
  }

  if (order.orderStatus === "cancelled") {
    return next(
      new AppError(
        StatusCodes.BAD_REQUEST,
        "Cancelled order status cannot be changed",
      ),
    );
  }

  if (orderStatus === "cancelled") {
    await restoreOrderProductStock(order);
  }

  order.orderStatus = orderStatus;

  if (orderStatus === "delivered") {
    order.deliveredAt = new Date();

    if (order.paymentMethod === "cod") {
      order.paymentStatus = "paid";
      order.paidAt = new Date();
      order.paymentInfo.provider = "cod";
      order.paymentInfo.providerStatus = "paid_on_delivery";
    }
  }

  await order.save({ validateBeforeSave: true });

  const populatedOrder = await populateOrder(Order.findById(order._id));

  if (previousOrderStatus !== populatedOrder.orderStatus) {
    await sendOrderStatusUpdateEmail(populatedOrder, previousOrderStatus);
  }

  return sendResponse(
    res,
    StatusCodes.OK,
    "Order status updated successfully",
    populatedOrder,
  );
}

export {
  createOrderFromCart,
  getMyOrders,
  getMyOrderById,
  getAllOrdersForAdmin,
  getOrderByIdForAdmin,
  updateOrderStatusForAdmin,
};
