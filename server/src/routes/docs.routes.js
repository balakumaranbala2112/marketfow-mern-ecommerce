import express from "express";
import swaggerUi from "swagger-ui-express";

import env from "../config/env.js";
import swaggerSpec from "../docs/swagger.js";
import StatusCodes from "../constants/statusCodes.js";
import AppError from "../utils/AppError.js";

const router = express.Router();

router.use((req, res, next) => {
  if (!env.docs.enabled) {
    return next(
      new AppError(StatusCodes.NOT_FOUND, "API documentation is disabled"),
    );
  }

  next();
});

router.get("/openapi.json", (req, res) => {
  return res.status(StatusCodes.OK).json(swaggerSpec);
});

router.use(
  "/",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    explorer: true,
    customSiteTitle: "MarketFlow API Docs",
  }),
);

export default router;
