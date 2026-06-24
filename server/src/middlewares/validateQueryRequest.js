import StatusCodes from "../constants/statusCodes.js";
import AppError from "../utils/AppError.js";

function validateQueryRequest(validator) {
  return function (req, res, next) {
    const errors = validator(req.query);

    if (errors.length > 0) {
      return next(
        new AppError(
          StatusCodes.BAD_REQUEST,
          "Invalid query parameters",
          errors,
        ),
      );
    }

    next();
  };
}

export default validateQueryRequest;
