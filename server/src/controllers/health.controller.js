import mongoose from "mongoose";

import sendResponse from "../utils/sendResponse.js";
import env from "../config/env.js";
import StatusCodes from "../constants/statusCodes.js";

function getDatabaseStatus() {
  const states = {
    0: "disconnected",
    1: "connected",
    2: "connecting",
    3: "disconnecting",
  };

  return states[mongoose.connection.readyState] || "unknown";
}

function getHome(req, res) {
  return sendResponse(res, StatusCodes.OK, "MarketFlow API is running", {
    app: "MarketFlow",
    environment: env.nodeEnv,
  });
}

function getHealth(req, res) {
  return sendResponse(res, StatusCodes.OK, "Health check successful", {
    status: "OK",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    database: {
      state: mongoose.connection.readyState,
      status: getDatabaseStatus(),
    },
  });
}

function getApiVersion(req, res) {
  return sendResponse(res, StatusCodes.OK, "MarketFlow API version", {
    version: env.apiVersion,
  });
}

export { getHome, getHealth, getApiVersion };
