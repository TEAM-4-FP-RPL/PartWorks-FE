import { useMutation } from '@tanstack/react-query';
import { loginUser } from '../api';

export function useLoginUser() {
  return useMutation({
    mutationFn: loginUser,
  });
}
