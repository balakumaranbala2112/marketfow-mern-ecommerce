import apiClient from "../../lib/axiosInstance.js";

export function getAllCategories(params = {}) {
  return apiClient.get("/categories", { params });
}

export function getCategoryById(categoryId) {
  return apiClient.get(`/categories/${categoryId}`);
}

export function createCategory(data) {
  return apiClient.post("/categories", data);
}

export function updateCategory(categoryId, data) {
  return apiClient.put(`/categories/${categoryId}`, data);
}

export function deleteCategory(categoryId) {
  return apiClient.delete(`/categories/${categoryId}`);
}
