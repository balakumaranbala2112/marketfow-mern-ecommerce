function asyncHandler(controller) {
  return function (req, res, next) {
    Promise.resolve()
      .then(() => controller(req, res, next))
      .catch((err) => next(err));
  };
}

export default asyncHandler;
