import User from "../models/user.model.js";

import StatusCodes from "../constants/statusCodes.js";
import AppError from "../utils/AppError.js";
import removeUndefinedFields from "../utils/removeUndefinedFields.js";
import sanitizeUser from "../utils/sanitizeUser.js";
import sendResponse from "../utils/sendResponse.js";

async function getMyProfile(req, res, next) {
    console.log("REQUEST.USER: ", req.user);
    console.log("REQUEST.ID: ", req.id);
    return sendResponse(res, StatusCodes.OK, "Profile fetched successfully", {
        user: sanitizeUser(req.user)
    })
}

async function updateMyProfile(req, res, next) {
    const { name, phone, avatar } = req.body;

    let updateData = {
        name: name !== undefined ? name.trim() : undefined,
        phone: phone !== undefined ? phone.trim() : undefined,
        avatar
    };

    updateData = removeUndefinedFields(updateData);

    console.log("REQUEST.USER: ", req.user);
    console.log("REQUEST.ID: ", req.user._id);

    const user = await User.findByIdAndUpdate(
        req.user._id,
        updateData,
        { new: true, runValidators: true }
    )

    if (!user) {
        return next(
            new AppError(
                StatusCodes.NOT_FOUND,
                "User profile not found"
            )
        );
    }

    return sendResponse(res, StatusCodes.OK, "Profile updated successfully", {
        user: sanitizeUser(user)
    })
}

export { getMyProfile, updateMyProfile };