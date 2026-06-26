import mongoose from "mongoose";

import User from "../models/user.model.js";

import Roles from "../constants/roles.js";
import StatusCodes from "../constants/statusCodes.js";
import AppError from "../utils/AppError.js";
import removeUndefinedFields from "../utils/removeUndefinedFields.js";
import sanitizeUser from "../utils/sanitizeUser.js";
import sendResponse from "../utils/sendResponse.js";
import { signAccessToken } from "../utils/token.js";

function buildPasswordChangeResponse(user) {
  const accessToken = signAccessToken({
    userId: user._id.toString(),
    role: user.role,
  });

  return {
    user: sanitizeUser(user),
    accessToken,
  };
}

function validateUserId(userId, next) {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    next(new AppError(StatusCodes.BAD_REQUEST, "Valid userId is required"));

    return false;
  }

  return true;
}

async function getMyProfile(req, res) {
  return sendResponse(res, StatusCodes.OK, "Profile fetched successfully", {
    user: sanitizeUser(req.user),
  });
}

async function updateMyProfile(req, res, next) {
  const { name, phone, avatar } = req.body;

  let updateData = {
    name: name !== undefined ? name.trim() : undefined,
    phone: phone !== undefined ? phone.trim() : undefined,
    avatar,
  };

  updateData = removeUndefinedFields(updateData);

  const user = await User.findByIdAndUpdate(req.user._id, updateData, {
    new: true,
    runValidators: true,
  });

  if (!user) {
    return next(new AppError(StatusCodes.NOT_FOUND, "User profile not found"));
  }

  return sendResponse(res, StatusCodes.OK, "Profile updated successfully", {
    user: sanitizeUser(user),
  });
}

async function changeMyPassword(req, res, next) {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user._id).select("+password");

  if (!user) {
    return next(new AppError(StatusCodes.NOT_FOUND, "User account not found"));
  }

  const isCurrentPasswordCorrect = await user.comparePassword(currentPassword);

  if (!isCurrentPasswordCorrect) {
    return next(
      new AppError(StatusCodes.UNAUTHORIZED, "Current password is incorrect"),
    );
  }

  user.password = newPassword;
  await user.save();

  return sendResponse(
    res,
    StatusCodes.OK,
    "Password changed successfully",
    buildPasswordChangeResponse(user),
  );
}

async function getAllUsersForAdmin(req, res) {
  const users = await User.find().sort({ createdAt: -1 });

  const sanitizedUsers = users.map((user) => sanitizeUser(user));

  return sendResponse(
    res,
    StatusCodes.OK,
    "Users fetched successfully",
    sanitizedUsers,
    {
      count: sanitizedUsers.length,
    },
  );
}

async function getUserByIdForAdmin(req, res, next) {
  const { userId } = req.params;

  if (!validateUserId(userId, next)) {
    return;
  }

  const user = await User.findById(userId);

  if (!user) {
    return next(new AppError(StatusCodes.NOT_FOUND, "User not found"));
  }

  return sendResponse(res, StatusCodes.OK, "User fetched successfully", {
    user: sanitizeUser(user),
  });
}

async function blockUserForAdmin(req, res, next) {
  const { userId } = req.params;

  if (!validateUserId(userId, next)) {
    return;
  }

  if (userId === req.user._id.toString()) {
    return next(
      new AppError(
        StatusCodes.BAD_REQUEST,
        "You cannot block your own admin account",
      ),
    );
  }

  const user = await User.findById(userId);

  if (!user) {
    return next(new AppError(StatusCodes.NOT_FOUND, "User not found"));
  }

  if (user.role === Roles.ADMIN) {
    return next(
      new AppError(
        StatusCodes.FORBIDDEN,
        "Admin accounts cannot be blocked from this endpoint",
      ),
    );
  }

  if (user.isBlocked) {
    return next(
      new AppError(StatusCodes.BAD_REQUEST, "User is already blocked"),
    );
  }

  user.isBlocked = true;
  await user.save({ validateBeforeSave: false });

  return sendResponse(res, StatusCodes.OK, "User blocked successfully", {
    user: sanitizeUser(user),
  });
}

async function unblockUserForAdmin(req, res, next) {
  const { userId } = req.params;

  if (!validateUserId(userId, next)) {
    return;
  }

  if (userId === req.user._id.toString()) {
    return next(
      new AppError(
        StatusCodes.BAD_REQUEST,
        "You cannot unblock your own admin account from this endpoint",
      ),
    );
  }

  const user = await User.findById(userId);

  if (!user) {
    return next(new AppError(StatusCodes.NOT_FOUND, "User not found"));
  }

  if (user.role === Roles.ADMIN) {
    return next(
      new AppError(
        StatusCodes.FORBIDDEN,
        "Admin accounts cannot be unblocked from this endpoint",
      ),
    );
  }

  if (!user.isBlocked) {
    return next(
      new AppError(StatusCodes.BAD_REQUEST, "User is already active"),
    );
  }

  user.isBlocked = false;
  await user.save({ validateBeforeSave: false });

  return sendResponse(res, StatusCodes.OK, "User unblocked successfully", {
    user: sanitizeUser(user),
  });
}

export {
  getMyProfile,
  updateMyProfile,
  changeMyPassword,
  getAllUsersForAdmin,
  getUserByIdForAdmin,
  blockUserForAdmin,
  unblockUserForAdmin,
};
