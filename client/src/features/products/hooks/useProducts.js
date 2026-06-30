import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllProducts, getProductById, getProductReviews, createProductReview } from "../productApi.js";

export function useProducts(params) {
  return useQuery({
    queryKey: ["products", params],
    queryFn: () => getAllProducts(params),
    select: (res) => ({
      products: res.data.data,
      // API returns pagination/filters at root level, not inside a meta wrapper
      meta: {
        pagination: res.data.pagination,
        filters: res.data.filters,
        count: res.data.count,
      },
    }),
  });
}

export function useProduct(productId) {
  return useQuery({
    queryKey: ["product", productId],
    queryFn: () => getProductById(productId),
    select: (res) => res.data.data,
    enabled: !!productId,
  });
}

export function useProductReviews(productId) {
  return useQuery({
    queryKey: ["productReviews", productId],
    queryFn: () => getProductReviews(productId),
    select: (res) => ({
      reviews: res.data.data,
      count: res.data.meta?.count || 0,
    }),
    enabled: !!productId,
  });
}

export function useCreateReview(productId) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => createProductReview(productId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["productReviews", productId] });
      queryClient.invalidateQueries({ queryKey: ["product", productId] });
    },
  });
}
