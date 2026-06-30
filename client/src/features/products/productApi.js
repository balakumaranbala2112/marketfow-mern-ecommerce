import apiClient from "../../lib/axiosInstance.js";

export function getAllProducts(params = {}) {
  return apiClient.get("/products", { params });
}

export function getProductById(productId) {
  return apiClient.get(`/products/${productId}`);
}

export function getProductReviews(productId) {
  return apiClient.get(`/products/${productId}/reviews`);
}

export function createProductReview(productId, { rating, comment }) {
  return apiClient.post(`/products/${productId}/reviews`, { rating, comment });
}

export function createProduct(data) {
  return apiClient.post("/products", data);
}

export function updateProduct(productId, data) {
  return apiClient.put(`/products/${productId}`, data);
}

export function deleteProduct(productId) {
  return apiClient.delete(`/products/${productId}`);
}

export function uploadProductImages(productId, formData) {
  return apiClient.post(`/products/${productId}/images`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}
