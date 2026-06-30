import apiClient from "../../lib/axiosInstance.js";

export function loginUser({ email, password }) {
  return apiClient.post("/auth/login", { email, password });
}

export function registerUser({ name, email, password }) {
  return apiClient.post("/auth/register", { name, email, password });
}

export function getMe() {
  return apiClient.get("/auth/me");
}

export function forgotPassword({ email }) {
  return apiClient.post("/auth/forgot-password", { email });
}

export function resetPassword(resetToken, { password }) {
  return apiClient.post(`/auth/reset-password/${resetToken}`, { password });
}
