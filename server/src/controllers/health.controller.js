import sendResponse from "../utils/sendResponse.js";
import env from "../config/env.js";

function getHome(req, res) {
  return sendResponse(res, 200, "MarketFlow API is running", {
    app: "MarketFlow",
    environment: env.nodeEnv,
  });
}

function getHealth(req, res) {
  return sendResponse(res, 200, "Health check successfull", {
    status: "OK",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
}

function getApiVersion(req, res) {
  return sendResponse(res, 200, "MarketFlow API version", {
    version: env.apiVersion,
  });
}

export { getHome, getHealth, getApiVersion };
