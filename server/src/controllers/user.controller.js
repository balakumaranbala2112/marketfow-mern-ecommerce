import User from "../models/user.model.js";

import StatusCodes from "../constants/statusCodes.js";
import AppError from "../utils/AppError.js";
import removeUndefinedFields from "../utils/removeUndefinedFields.js";
import sanitizeUser from "../utils/sanitizeUser.js";
import sendResponse from "../utils/sendResponse.js";
import { signAccessToken } from "../utils/token.js";

function buildPasswordChangeResponse(user) {
    const accessToken = signAccessToken({
        userId: user._id.toString(),
        role: user.role
    });

    return {
        user: sanitizeUser(user),
        accessToken
    };
}

async function getMyProfile(req, res) {
    return sendResponse(
        res,
        StatusCodes.OK,
        "Profile fetched successfully",
        {
            user: sanitizeUser(req.user)
        }
    );
}

async function updateMyProfile(req, res, next) {
    const { name, phone, avatar } = req.body;

    let updateData = {
        name: name !== undefined ? name.trim() : undefined,
        phone: phone !== undefined ? phone.trim() : undefined,
        avatar
    };

    updateData = removeUndefinedFields(updateData);

    const user = await User.findByIdAndUpdate(
        req.user._id,
        updateData,
        {
            new: true,
            runValidators: true
        }
    );

    if (!user) {
        return next(
            new AppError(
                StatusCodes.NOT_FOUND,
                "User profile not found"
            )
        );
    }

    return sendResponse(
        res,
        StatusCodes.OK,
        "Profile updated successfully",
        {
            user: sanitizeUser(user)
        }
    );
}

async function changeMyPassword(req, res, next) {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id).select("+password");

    if (!user) {
        return next(
            new AppError(
                StatusCodes.NOT_FOUND,
                "User account not found"
            )
        );
    }

    const isCurrentPasswordCorrect = await user.comparePassword(
        currentPassword
    );

    if (!isCurrentPasswordCorrect) {
        return next(
            new AppError(
                StatusCodes.UNAUTHORIZED,
                "Current password is incorrect"
            )
        );
    }

    user.password = newPassword;
    await user.save();

    return sendResponse(
        res,
        StatusCodes.OK,
        "Password changed successfully",
        buildPasswordChangeResponse(user)
    );
}

export {
    getMyProfile,
    updateMyProfile,
    changeMyPassword
};