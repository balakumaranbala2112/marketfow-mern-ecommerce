import express from "express";

import {
    getMyProfile,
    updateMyProfile
} from "../controllers/user.controller.js";

import { protect } from "../middlewares/auth.middleware.js";
import validateRequest from "../middlewares/validateRequest.js";
import asyncHandler from "../utils/asyncHandler.js";
import { validateUpdateProfile } from "../validators/user.validator.js";

const router = express.Router();

router
    .route("/profile")
    .get(
        protect,
        asyncHandler(getMyProfile)
    )
    .put(
        protect,
        validateRequest(validateUpdateProfile),
        asyncHandler(updateMyProfile)
    );

export default router;