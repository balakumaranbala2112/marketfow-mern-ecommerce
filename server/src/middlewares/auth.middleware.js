import User from "../models/user.model.js";

import StatusCodes from "../constants/statusCodes.js";
import AppError from "../utils/AppError.js";
import { verifyAccessToken } from "../utils/token.js";

function extractTokenFromHeader(authorizationHeader) {
  if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
    return null;
  }

  return authorizationHeader.split(" ")[1];
}

async function protect(req, res, next) {
  try {
    const token = extractTokenFromHeader(req.headers.authorization);

    if (!token) {
      return next(
        new AppError(
          StatusCodes.UNAUTHORIZED,
          "Authentication token is missing",
        ),
      );
    }

    const decoded = verifyAccessToken(token);

    const user = await User.findById(decoded.userId);

    if (!user) {
      return next(
        new AppError(
          StatusCodes.UNAUTHORIZED,
          "User belonging to this token no longer exists",
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

    // Controllers after this middleware can access the logged-in user.
    req.user = user;

    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return next(
        new AppError(
          StatusCodes.UNAUTHORIZED,
          "Authentication token has expired",
        ),
      );
    }

    if (err.name === "JsonWebTokenError") {
      return next(
        new AppError(StatusCodes.UNAUTHORIZED, "Invalid authentication token"),
      );
    }

    next(err);
  }
}

function authorizeRoles(...allowedRoles) {
  return function (req, res, next) {
    if (!req.user) {
      return next(
        new AppError(StatusCodes.UNAUTHORIZED, "Authentication is required"),
      );
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(
        new AppError(
          StatusCodes.FORBIDDEN,
          "You do not have permission to perform this action",
        ),
      );
    }

    next();
  };
}

export { protect, authorizeRoles };
