import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createCategory } from '../api';

export function useCreateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (name: string) => createCategory(name),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['categories'] }),
  });
}
