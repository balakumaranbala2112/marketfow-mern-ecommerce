import apiClient from "../../lib/axiosInstance.js";

export function createOrderFromCart({ shippingAddress, paymentMethod }) {
  return apiClient.post("/orders", { shippingAddress, paymentMethod });
}

export function getMyOrders() {
  return apiClient.get("/orders/my-orders");
}

export function getMyOrderById(orderId) {
  return apiClient.get(`/orders/${orderId}`);
}

export function getAllOrdersForAdmin() {
  return apiClient.get("/orders/admin");
}

export function getOrderByIdForAdmin(orderId) {
  return apiClient.get(`/orders/admin/${orderId}`);
}

export function updateOrderStatus(orderId, { orderStatus }) {
  return apiClient.put(`/orders/admin/${orderId}/status`, { orderStatus });
}
