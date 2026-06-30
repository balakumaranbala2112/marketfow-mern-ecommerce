import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createOrderFromCart, getMyOrders, getMyOrderById } from "../orderApi.js";

export function useCreateOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createOrderFromCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["myOrders"] });
    },
  });
}

export function useMyOrders() {
  return useQuery({
    queryKey: ["myOrders"],
    queryFn: getMyOrders,
    select: (res) => res.data.data,
  });
}

export function useMyOrder(orderId) {
  return useQuery({
    queryKey: ["myOrder", orderId],
    queryFn: () => getMyOrderById(orderId),
    select: (res) => res.data.data,
    enabled: !!orderId,
  });
}
