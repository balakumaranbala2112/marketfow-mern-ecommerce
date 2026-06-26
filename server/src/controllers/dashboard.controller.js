import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import User from "../models/user.model.js";

import Roles from "../constants/roles.js";
import StatusCodes from "../constants/statusCodes.js";
import sendResponse from "../utils/sendResponse.js";

const orderStatuses = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

const paymentStatuses = ["pending", "paid", "failed", "refunded"];

function buildCountMap(stats, keys) {
  const countMap = {};

  keys.forEach((key) => {
    countMap[key] = 0;
  });

  stats.forEach((item) => {
    if (item._id) {
      countMap[item._id] = item.count;
    }
  });

  return countMap;
}

async function getUserSummary() {
  const [totalUsers, totalCustomers, totalAdmins, blockedUsers] =
    await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: Roles.CUSTOMER }),
      User.countDocuments({ role: Roles.ADMIN }),
      User.countDocuments({ isBlocked: true }),
    ]);

  return {
    totalUsers,
    totalCustomers,
    totalAdmins,
    blockedUsers,
    activeUsers: totalUsers - blockedUsers,
  };
}

async function getProductSummary() {
  const lowStockThreshold = 5;

  const [totalProducts, activeProducts, inactiveProducts, lowStockProducts] =
    await Promise.all([
      Product.countDocuments(),
      Product.countDocuments({ isActive: true }),
      Product.countDocuments({ isActive: false }),
      Product.countDocuments({
        isActive: true,
        stock: {
          $lte: lowStockThreshold,
        },
      }),
    ]);

  return {
    totalProducts,
    activeProducts,
    inactiveProducts,
    lowStockProducts,
    lowStockThreshold,
  };
}

async function getOrderSummary() {
  const [totalOrders, orderStatusStats] = await Promise.all([
    Order.countDocuments(),
    Order.aggregate([
      {
        $group: {
          _id: "$orderStatus",
          count: {
            $sum: 1,
          },
        },
      },
    ]),
  ]);

  return {
    totalOrders,
    ...buildCountMap(orderStatusStats, orderStatuses),
  };
}

async function getPaymentSummary() {
  const paymentStatusStats = await Order.aggregate([
    {
      $group: {
        _id: "$paymentStatus",
        count: {
          $sum: 1,
        },
      },
    },
  ]);

  return buildCountMap(paymentStatusStats, paymentStatuses);
}

async function getSalesSummary() {
  const salesStats = await Order.aggregate([
    {
      $match: {
        paymentStatus: "paid",
      },
    },
    {
      $group: {
        _id: null,
        totalRevenue: {
          $sum: "$totalPrice",
        },
        paidOrdersCount: {
          $sum: 1,
        },
        averageOrderValue: {
          $avg: "$totalPrice",
        },
      },
    },
  ]);

  if (salesStats.length === 0) {
    return {
      totalRevenue: 0,
      paidOrdersCount: 0,
      averageOrderValue: 0,
    };
  }

  return {
    totalRevenue: salesStats[0].totalRevenue,
    paidOrdersCount: salesStats[0].paidOrdersCount,
    averageOrderValue: Math.round(salesStats[0].averageOrderValue * 100) / 100,
  };
}

async function getRecentOrders() {
  return Order.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .populate("user", "name email")
    .select("user orderStatus paymentStatus totalPrice paymentMethod createdAt")
    .lean();
}

async function getAdminDashboardSummary(req, res) {
  const [users, products, orders, payments, sales, recentOrders] =
    await Promise.all([
      getUserSummary(),
      getProductSummary(),
      getOrderSummary(),
      getPaymentSummary(),
      getSalesSummary(),
      getRecentOrders(),
    ]);

  return sendResponse(
    res,
    StatusCodes.OK,
    "Admin dashboard summary fetched successfully",
    {
      users,
      products,
      orders,
      payments,
      sales,
      recentOrders,
    },
  );
}

export { getAdminDashboardSummary };
