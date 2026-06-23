import express from "express";

import {
  getHome,
  getHealth,
  getApiVersion,
} from "../controllers/health.controller.js";

const router = express.Router();

router.get("/", getHome);

router.get("/health", getHealth);

router.get("/api/v1", getApiVersion);

export default router;
