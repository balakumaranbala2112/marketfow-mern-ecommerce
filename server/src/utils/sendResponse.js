function sendResponse(res, statusCode, message, data = null, extra = {}) {
  return res.status(statusCode).json({
    success: true,
    message,
    ...extra,
    data,
  });
}

export default sendResponse;
