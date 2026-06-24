import StatusCodes from "../constants/statusCodes.js";
import AppError from "../utils/AppError.js";

function validateRequest(validator) {
  return function (req, res, next) {
    const errors = validator(req.body);

    if (errors.length > 0) {
      return next(
        new AppError(StatusCodes.BAD_REQUEST, "Validation failed", errors),
      );
    }

    next();
  };
}

export default validateRequest;
