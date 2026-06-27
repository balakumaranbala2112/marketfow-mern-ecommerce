import User from "../models/user.model.js";

import Roles from "../constants/roles.js";
import StatusCodes from "../constants/statusCodes.js";
import AppError from "../utils/AppError.js";
import sanitizeUser from "../utils/sanitizeUser.js";
import sendResponse from "../utils/sendResponse.js";
import { signAccessToken } from "../utils/token.js";

import crypto from "node:crypto";
import env from "../config/env.js";
import { sendPasswordResetEmail } from "../services/email.service.js";

const PASSWORD_RESET_TOKEN_EXPIRES_MINUTES = 10;

function buildAuthResponse(user) {
  const accessToken = signAccessToken({
    userId: user._id.toString(),
    role: user.role,
  });

  return {
    user: sanitizeUser(user),
    accessToken,
  };
}

async function registerUser(req, res, next) {
  const { name, email, password } = req.body;

  const normalizedEmail = email.trim().toLowerCase();

  const emailExists = await User.exists({ email: normalizedEmail });

  if (emailExists) {
    return next(
      new AppError(StatusCodes.CONFLICT, "Email already registered", [
        "Please login or use another email address",
      ]),
    );
  }

  const user = await User.create({
    name: name.trim(),
    email: normalizedEmail,
    password,
    role: Roles.CUSTOMER,
  });

  return sendResponse(
    res,
    StatusCodes.CREATED,
    "User registered successfully",
    buildAuthResponse(user),
  );
}

async function loginUser(req, res, next) {
  const { email, password } = req.body;

  const normalizedEmail = email.trim().toLowerCase();

  const user = await User.findOne({ email: normalizedEmail }).select(
    "+password",
  );

  if (!user) {
    return next(
      new AppError(StatusCodes.UNAUTHORIZED, "Invalid email or password"),
    );
  }

  if (user.isBlocked) {
    return next(
      new AppError(
        StatusCodes.FORBIDDEN,
        "Your account has been blocked. Please contact support.",
      ),
    );
  }

  const isPasswordCorrect = await user.comparePassword(password);

  if (!isPasswordCorrect) {
    return next(
      new AppError(StatusCodes.UNAUTHORIZED, "Invalid email or password"),
    );
  }

  user.lastLoginAt = new Date();
  await user.save({ validateBeforeSave: false });

  return sendResponse(
    res,
    StatusCodes.OK,
    "Login successful",
    buildAuthResponse(user),
  );
}

async function getMe(req, res) {
  return sendResponse(
    res,
    StatusCodes.OK,
    "Current user fetched successfully",
    {
      user: sanitizeUser(req.user),
    },
  );
}

function createPasswordResetToken() {
  const resetToken = crypto.randomBytes(32).toString("hex");

  const hashedResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  return {
    resetToken,
    hashedResetToken,
  };
}

function buildResetPasswordUrl(resetToken) {
  return `${env.clientUrl}/reset-password/${resetToken}`;
}

function buildGenericForgotPasswordResponse(res) {
  return sendResponse(
    res,
    StatusCodes.OK,
    "If an account with that email exists, a password reset link has been sent",
  );
}

async function forgotPassword(req, res) {
  const email = req.body.email.trim().toLowerCase();

  const user = await User.findOne({ email });

  if (!user) {
    return buildGenericForgotPasswordResponse(res);
  }

  if (user.isBlocked) {
    return buildGenericForgotPasswordResponse(res);
  }

  const { resetToken, hashedResetToken } = createPasswordResetToken();

  user.passwordResetToken = hashedResetToken;
  user.passwordResetExpires = new Date(
    Date.now() + PASSWORD_RESET_TOKEN_EXPIRES_MINUTES * 60 * 1000,
  );

  await user.save({ validateBeforeSave: false });

  const resetUrl = buildResetPasswordUrl(resetToken);

  await sendPasswordResetEmail({
    user,
    resetUrl,
    expiresInMinutes: PASSWORD_RESET_TOKEN_EXPIRES_MINUTES,
  });

  return buildGenericForgotPasswordResponse(res);
}

async function resetPassword(req, res, next) {
  const { resetToken } = req.params;
  const { password } = req.body;

  const hashedResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedResetToken,
    passwordResetExpires: {
      $gt: Date.now(),
    },
  }).select("+passwordResetToken +passwordResetExpires");

  if (!user) {
    return next(
      new AppError(
        StatusCodes.BAD_REQUEST,
        "Password reset token is invalid or has expired",
      ),
    );
  }

  if (user.isBlocked) {
    return next(
      new AppError(
        StatusCodes.FORBIDDEN,
        "Your account has been blocked. Please contact support.",
      ),
    );
  }

  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save();

  const accessToken = signAccessToken({
    userId: user._id.toString(),
    role: user.role,
  });

  return sendResponse(res, StatusCodes.OK, "Password reset successfully", {
    user: sanitizeUser(user),
    accessToken,
  });
}

export { registerUser, loginUser, getMe, forgotPassword, resetPassword };
