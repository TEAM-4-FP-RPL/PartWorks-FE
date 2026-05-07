import { useMutation } from '@tanstack/react-query';
import { loginUser } from '../api';
import { toast } from 'sonner';

export function useLoginUser() {
  return useMutation({
    mutationFn: loginUser,
    onError: () => toast.error('Login gagal. Periksa email dan password Anda.'),
  });
}
