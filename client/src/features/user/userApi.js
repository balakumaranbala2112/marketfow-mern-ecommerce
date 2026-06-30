import apiClient from "../../lib/axiosInstance.js";

export function getMyProfile() {
  return apiClient.get("/users/profile");
}

export function updateMyProfile({ name, phone }) {
  return apiClient.put("/users/profile", { name, phone });
}

export function changeMyPassword({ currentPassword, newPassword }) {
  return apiClient.put("/users/change-password", { currentPassword, newPassword });
}

export function uploadAvatar(formData) {
  return apiClient.post("/users/avatar", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}

export function deleteAvatar() {
  return apiClient.delete("/users/avatar");
}
