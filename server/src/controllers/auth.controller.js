import User from "../models/user.model.js";

import Roles from "../constants/roles.js";
import StatusCodes from "../constants/statusCodes.js";
import AppError from "../utils/AppError.js";
import sanitizeUser from "../utils/sanitizeUser.js";
import sendResponse from "../utils/sendResponse.js";
import { signAccessToken } from "../utils/token.js";

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

  const accessToken = signAccessToken({
    userId: user._id.toString(),
    role: user.role,
  });

  return sendResponse(
    res,
    StatusCodes.CREATED,
    "User registered successfully",
    {
      user: sanitizeUser(user),
      accessToken,
    },
  );
}

export { registerUser };
