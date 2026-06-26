import express from "express";

import Roles from "../constants/roles.js";
import { getAdminDashboardSummary } from "../controllers/dashboard.controller.js";
import { authorizeRoles, protect } from "../middlewares/auth.middleware.js";
import asyncHandler from "../utils/asyncHandler.js";

const router = express.Router();

router.get(
  "/admin/summary",
  protect,
  authorizeRoles(Roles.ADMIN),
  asyncHandler(getAdminDashboardSummary),
);

export default router;
