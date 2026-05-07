import { registerUser } from '@/features/auth/api';
import { useMutation } from '@tanstack/react-query';

export function useRegisterUser() {
  return useMutation({
    mutationFn: registerUser,
  });
}
