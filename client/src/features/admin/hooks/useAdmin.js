import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getDashboardSummary, getAllUsersForAdmin, blockUser, unblockUser, getAllCouponsForAdmin, createCoupon } from "../adminApi.js";
import { getAllOrdersForAdmin, getOrderByIdForAdmin, updateOrderStatus } from "../../orders/orderApi.js";
import { getAllProducts, createProduct, updateProduct, deleteProduct } from "../../products/productApi.js";
import { getAllCategories, createCategory, updateCategory, deleteCategory } from "../../categories/categoryApi.js";

export function useDashboardSummary() {
  return useQuery({
    queryKey: ["adminDashboard"],
    queryFn: getDashboardSummary,
    select: (res) => res.data.data,
  });
}

export function useAdminOrders() {
  return useQuery({
    queryKey: ["adminOrders"],
    queryFn: getAllOrdersForAdmin,
    select: (res) => res.data.data,
  });
}

export function useAdminOrderDetail(orderId) {
  return useQuery({
    queryKey: ["adminOrder", orderId],
    queryFn: () => getOrderByIdForAdmin(orderId),
    select: (res) => res.data.data,
    enabled: !!orderId,
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ orderId, orderStatus }) => updateOrderStatus(orderId, { orderStatus }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminOrders"] });
      queryClient.invalidateQueries({ queryKey: ["adminOrder"] });
      queryClient.invalidateQueries({ queryKey: ["adminDashboard"] });
    },
  });
}

export function useAdminUsers() {
  return useQuery({
    queryKey: ["adminUsers"],
    queryFn: getAllUsersForAdmin,
    select: (res) => res.data.data,
  });
}

export function useBlockUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: blockUser,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["adminUsers"] }),
  });
}

export function useUnblockUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: unblockUser,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["adminUsers"] }),
  });
}

export function useAdminProducts(params) {
  return useQuery({
    queryKey: ["adminProducts", params],
    queryFn: () => getAllProducts(params),
    select: (res) => ({
      products: res.data.data,
      meta: {
        pagination: res.data.pagination,
        filters: res.data.filters,
        count: res.data.count,
      },
    }),
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createProduct,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["adminProducts"] }),
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ productId, data }) => updateProduct(productId, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["adminProducts"] }),
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["adminProducts"] }),
  });
}

export function useAdminCategories() {
  return useQuery({
    queryKey: ["adminCategories"],
    queryFn: () => getAllCategories(),
    select: (res) => res.data.data,
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createCategory,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["adminCategories"] }),
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ categoryId, data }) => updateCategory(categoryId, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["adminCategories"] }),
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["adminCategories"] }),
  });
}

export function useAdminCoupons() {
  return useQuery({
    queryKey: ["adminCoupons"],
    queryFn: getAllCouponsForAdmin,
    select: (res) => res.data.data,
  });
}

export function useCreateCoupon() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createCoupon,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["adminCoupons"] }),
  });
}
