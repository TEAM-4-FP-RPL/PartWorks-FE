import { registerUser } from '@/features/auth/api';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

export function useRegisterUser() {
  return useMutation({
    mutationFn: registerUser,
    onSuccess: () => toast.success('Registrasi berhasil! Silakan login.'),
    onError: () => toast.error('Registrasi gagal. Coba lagi.'),
  });
}
