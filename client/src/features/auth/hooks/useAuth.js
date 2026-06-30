import { useMutation } from "@tanstack/react-query";
import { loginUser, registerUser, forgotPassword, resetPassword } from "../authApi.js";

export function useLogin() {
  return useMutation({
    mutationFn: loginUser,
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: registerUser,
  });
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: forgotPassword,
  });
}

export function useResetPassword() {
  return useMutation({
    mutationFn: ({ resetToken, password }) =>
      resetPassword(resetToken, { password }),
  });
}
