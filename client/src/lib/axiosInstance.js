import axios from "axios";

import config from "./config.js";
import normalizeApiError from "./apiError.js";

/* 

axios.get("http://localhost:5000/api/v1/cart", {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("accessToken")}`
  }
});

Better way: apiClient.get("/cart");

*/

const apiClient = axios.create({
  baseURL: config.apiUrl,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

apiClient.interceptors.request.use(
  function (requestConfig) {
    const accessToken = localStorage.getItem("accessToken");

    requestConfig.headers = requestConfig.headers || {};

    if (accessToken) {
      requestConfig.headers.Authorization = `Bearer ${accessToken}`;
    }

    return requestConfig;
  },
  function (error) {
    return Promise.reject(normalizeApiError(error));
  },
);

apiClient.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    const normalizedError = normalizeApiError(error);

    if (normalizedError.statusCode === 401) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
    }

    return Promise.reject(normalizedError);
  },
);

export default apiClient;
