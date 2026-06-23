import AppError from "../utils/AppError.js";

function notFound(req, res, next) {
  next(new AppError(404, `Route not Found: ${req.originalUrl}`));
}

export default notFound;
