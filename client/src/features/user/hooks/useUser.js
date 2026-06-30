import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMyProfile, updateMyProfile, changeMyPassword, uploadAvatar, deleteAvatar } from "../userApi.js";

export function useProfile() {
  return useQuery({
    queryKey: ["profile"],
    queryFn: getMyProfile,
    select: (res) => res.data.data.user,
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateMyProfile,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["profile"] }),
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: changeMyPassword,
  });
}

export function useUploadAvatar() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: uploadAvatar,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["profile"] }),
  });
}

export function useDeleteAvatar() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteAvatar,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["profile"] }),
  });
}
