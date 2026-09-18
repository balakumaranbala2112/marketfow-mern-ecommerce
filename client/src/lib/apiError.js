function getApiErrorMessage(error) {
  return (
    error.response?.data?.message ||
    error.message ||
    "Something went wrong"
  );
}

function getApiErrorErrors(error) {
  return error.response?.data?.errors || [];
}

function normalizeApiError(error) {
  return {
    message: getApiErrorMessage(error),
    errors: getApiErrorErrors(error),
    statusCode: error.response?.status || 500,
    raw: error
  };
}

export {
  getApiErrorMessage,
  getApiErrorErrors,
  normalizeApiError
};