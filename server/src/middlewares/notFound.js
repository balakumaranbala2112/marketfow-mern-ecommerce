import StatusCodes from "../constants/statusCodes.js";
import AppError from "../utils/AppError.js";

function notFound(req, res, next) {
  return next(
    new AppError(
      StatusCodes.NOT_FOUND,
      `Cannot ${req.method} ${req.originalUrl}`,
    ),
  );
}

export default notFound;
