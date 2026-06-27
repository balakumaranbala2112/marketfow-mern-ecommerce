import Coupon from "../models/coupon.model.js";
import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import WebhookEvent from "../models/webhookEvent.model.js";

import env from "../config/env.js";
import StatusCodes from "../constants/statusCodes.js";
import AppError from "../utils/AppError.js";
import sendResponse from "../utils/sendResponse.js";
import { verifyRazorpayWebhookSignature } from "../utils/razorpay.js";

function ensureWebhookConfigured(next) {
  if (!env.payment.razorpay.webhookSecret) {
    next(
      new AppError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        "Razorpay webhook is not configured",
      ),
    );

    return false;
  }

  return true;
}

function getWebhookSignature(req) {
  return req.headers["x-razorpay-signature"];
}

function getWebhookEventId(req) {
  return req.headers["x-razorpay-event-id"] || "";
}

function parseWebhookPayload(rawBody) {
  return JSON.parse(rawBody.toString("utf8"));
}

function getPaymentEntity(payload) {
  return payload?.payload?.payment?.entity || null;
}

async function populateOrder(orderId) {
  return Order.findById(orderId)
    .populate("user", "name email phone")
    .populate("orderItems.product", "name slug");
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

async function createWebhookEvent({
  eventId,
  eventType,
  status,
  order = null,
  providerOrderId = "",
  providerPaymentId = "",
  errorMessage = "",
}) {
  return WebhookEvent.create({
    provider: "razorpay",
    eventId,
    eventType,
    status,
    order,
    providerOrderId,
    providerPaymentId,
    errorMessage,
  });
}

async function handlePaymentCaptured({ eventId, eventType, payment }) {
  if (!payment) {
    await createWebhookEvent({
      eventId,
      eventType,
      status: "ignored",
      errorMessage: "Payment entity missing",
    });

    return {
      status: "ignored",
      message: "Payment entity missing",
    };
  }

  const providerOrderId = payment.order_id;
  const providerPaymentId = payment.id;

  const order = await Order.findOne({
    "paymentInfo.provider": "razorpay",
    "paymentInfo.providerOrderId": providerOrderId,
  });

  if (!order) {
    await createWebhookEvent({
      eventId,
      eventType,
      status: "ignored",
      providerOrderId,
      providerPaymentId,
      errorMessage: "Local order not found",
    });

    return {
      status: "ignored",
      message: "Local order not found for Razorpay payment",
    };
  }

  if (order.paymentStatus === "paid") {
    await createWebhookEvent({
      eventId,
      eventType,
      status: "ignored",
      order: order._id,
      providerOrderId,
      providerPaymentId,
      errorMessage: "Order already paid",
    });

    return {
      status: "ignored",
      message: "Order already paid",
    };
  }

  if (order.orderStatus === "cancelled") {
    await createWebhookEvent({
      eventId,
      eventType,
      status: "ignored",
      order: order._id,
      providerOrderId,
      providerPaymentId,
      errorMessage: "Order already cancelled",
    });

    return {
      status: "ignored",
      message: "Order already cancelled",
    };
  }

  order.paymentStatus = "paid";
  order.paymentFailureReason = "";
  order.paidAt = new Date();
  order.paymentExpiresAt = null;
  order.orderStatus =
    order.orderStatus === "pending" ? "confirmed" : order.orderStatus;

  order.paymentInfo.providerPaymentId = providerPaymentId;
  order.paymentInfo.providerStatus = payment.status || "captured";
  order.paymentInfo.rawResponse = payment;

  await order.save({ validateBeforeSave: false });

  if (order.coupon?.coupon) {
    await Coupon.findByIdAndUpdate(order.coupon.coupon, {
      $inc: {
        usedCount: 1,
      },
    });
  }

  await createWebhookEvent({
    eventId,
    eventType,
    status: "processed",
    order: order._id,
    providerOrderId,
    providerPaymentId,
  });

  const populatedOrder = await populateOrder(order._id);

  return {
    status: "processed",
    message: "Payment captured webhook processed",
    order: populatedOrder,
  };
}

async function handlePaymentFailed({ eventId, eventType, payment }) {
  if (!payment) {
    await createWebhookEvent({
      eventId,
      eventType,
      status: "ignored",
      errorMessage: "Payment entity missing",
    });

    return {
      status: "ignored",
      message: "Payment entity missing",
    };
  }

  const providerOrderId = payment.order_id;
  const providerPaymentId = payment.id;

  const order = await Order.findOne({
    "paymentInfo.provider": "razorpay",
    "paymentInfo.providerOrderId": providerOrderId,
  });

  if (!order) {
    await createWebhookEvent({
      eventId,
      eventType,
      status: "ignored",
      providerOrderId,
      providerPaymentId,
      errorMessage: "Local order not found",
    });

    return {
      status: "ignored",
      message: "Local order not found for failed Razorpay payment",
    };
  }

  if (order.paymentStatus === "paid") {
    await createWebhookEvent({
      eventId,
      eventType,
      status: "ignored",
      order: order._id,
      providerOrderId,
      providerPaymentId,
      errorMessage: "Order already paid",
    });

    return {
      status: "ignored",
      message: "Order already paid, failed webhook ignored",
    };
  }

  if (order.orderStatus === "cancelled") {
    await createWebhookEvent({
      eventId,
      eventType,
      status: "ignored",
      order: order._id,
      providerOrderId,
      providerPaymentId,
      errorMessage: "Order already cancelled",
    });

    return {
      status: "ignored",
      message: "Order already cancelled",
    };
  }

  order.paymentStatus = "failed";
  order.paymentFailureReason =
    payment.error_description ||
    payment.error_reason ||
    "Razorpay payment failed";
  order.paymentInfo.providerPaymentId = providerPaymentId;
  order.paymentInfo.providerStatus = payment.status || "failed";
  order.paymentInfo.rawResponse = payment;

  await order.save({ validateBeforeSave: false });

  await createWebhookEvent({
    eventId,
    eventType,
    status: "processed",
    order: order._id,
    providerOrderId,
    providerPaymentId,
  });

  const populatedOrder = await populateOrder(order._id);

  return {
    status: "processed",
    message: "Payment failed webhook processed",
    order: populatedOrder,
  };
}

async function handleOrderPaid({ eventId, eventType, payload }) {
  const payment = getPaymentEntity(payload);

  if (!payment) {
    await createWebhookEvent({
      eventId,
      eventType,
      status: "ignored",
      errorMessage: "Payment entity missing in order.paid payload",
    });

    return {
      status: "ignored",
      message: "Payment entity missing",
    };
  }

  return handlePaymentCaptured({
    eventId,
    eventType,
    payment,
  });
}

async function handleUnsupportedWebhook({ eventId, eventType }) {
  await createWebhookEvent({
    eventId,
    eventType,
    status: "ignored",
    errorMessage: "Unsupported webhook event",
  });

  return {
    status: "ignored",
    message: `Unsupported webhook event: ${eventType}`,
  };
}

async function handleRazorpayWebhook(req, res, next) {
  if (!ensureWebhookConfigured(next)) {
    return;
  }

  const webhookSignature = getWebhookSignature(req);
  const eventId = getWebhookEventId(req);

  if (!webhookSignature) {
    return next(
      new AppError(
        StatusCodes.BAD_REQUEST,
        "Missing Razorpay webhook signature",
      ),
    );
  }

  if (!eventId) {
    return next(
      new AppError(
        StatusCodes.BAD_REQUEST,
        "Missing Razorpay webhook event id",
      ),
    );
  }

  const duplicateEvent = await WebhookEvent.exists({
    provider: "razorpay",
    eventId,
  });

  if (duplicateEvent) {
    return sendResponse(
      res,
      StatusCodes.OK,
      "Duplicate Razorpay webhook ignored",
      {
        status: "ignored",
        eventId,
      },
    );
  }

  const isValidSignature = verifyRazorpayWebhookSignature({
    rawBody: req.body,
    webhookSignature,
  });

  if (!isValidSignature) {
    return next(
      new AppError(
        StatusCodes.BAD_REQUEST,
        "Invalid Razorpay webhook signature",
      ),
    );
  }

  let payload;

  try {
    payload = parseWebhookPayload(req.body);
  } catch {
    return next(
      new AppError(StatusCodes.BAD_REQUEST, "Invalid Razorpay webhook payload"),
    );
  }

  const eventType = payload.event;

  let result;

  if (eventType === "payment.captured") {
    result = await handlePaymentCaptured({
      eventId,
      eventType,
      payment: getPaymentEntity(payload),
    });
  } else if (eventType === "payment.failed") {
    result = await handlePaymentFailed({
      eventId,
      eventType,
      payment: getPaymentEntity(payload),
    });
  } else if (eventType === "order.paid") {
    result = await handleOrderPaid({
      eventId,
      eventType,
      payload,
    });
  } else {
    result = await handleUnsupportedWebhook({
      eventId,
      eventType,
    });
  }

  return sendResponse(
    res,
    StatusCodes.OK,
    "Razorpay webhook received successfully",
    {
      eventId,
      eventType,
      ...result,
    },
  );
}

export { handleRazorpayWebhook };
