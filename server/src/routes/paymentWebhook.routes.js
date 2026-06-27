import express from "express";

import { handleRazorpayWebhook } from "../controllers/paymentWebhook.controller.js";
import asyncHandler from "../utils/asyncHandler.js";

const router = express.Router();

router.post("/", asyncHandler(handleRazorpayWebhook));

export default router;
