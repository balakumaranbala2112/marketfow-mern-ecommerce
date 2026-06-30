/* function normalizeApiError(error) {
  if (error.response) {
    return {
      message:
        error.response.data?.message ||
        "Something went wrong. Please try again",
      statusCode: error.response.status,
      errors: error.response.data?.errors | [],
    };
  }

  if (error.request) {
    return {
      message: "Server is not responding. Please try again later.",
      statusCode: null,
      errors: [],
    };
  }

  return {
    message: error.message || "Unexpected error occurred.",
    statusCode: null,
    errors: [],
  };
}

export default normalizeApiError;
 */


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