function normalizeApiError(error) {
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
