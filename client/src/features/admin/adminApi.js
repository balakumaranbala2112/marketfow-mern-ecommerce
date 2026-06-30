import apiClient from "../../lib/axiosInstance.js";

export function getDashboardSummary() {
  return apiClient.get("/dashboard/admin/summary");
}

export function getAllUsersForAdmin() {
  return apiClient.get("/users/admin");
}

export function getUserByIdForAdmin(userId) {
  return apiClient.get(`/users/admin/${userId}`);
}

export function blockUser(userId) {
  return apiClient.put(`/users/admin/${userId}/block`);
}

export function unblockUser(userId) {
  return apiClient.put(`/users/admin/${userId}/unblock`);
}

export function getAllCouponsForAdmin() {
  return apiClient.get("/coupons/admin");
}

export function createCoupon(data) {
  return apiClient.post("/coupons/admin", data);
}
