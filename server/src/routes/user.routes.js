import express from "express";

import {
    changeMyPassword,
    getMyProfile,
    updateMyProfile
} from "../controllers/user.controller.js";

import { protect } from "../middlewares/auth.middleware.js";
import validateRequest from "../middlewares/validateRequest.js";
import asyncHandler from "../utils/asyncHandler.js";

import {
    validateChangePassword,
    validateUpdateProfile
} from "../validators/user.validator.js";

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

router.put(
    "/change-password",
    protect,
    validateRequest(validateChangePassword),
    asyncHandler(changeMyPassword)
);

export default router;