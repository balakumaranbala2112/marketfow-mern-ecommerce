import StatusCodes from "../constants/statusCodes.js";
import AppError from "../utils/AppError.js";

function notFound(req, res, next) {
  next(new AppError(StatusCodes.NOT_FOUND, `Route not Found: ${req.originalUrl}`));
}

export default notFound;
