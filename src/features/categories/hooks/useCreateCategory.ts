import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createCategory } from '../api';
import { toast } from 'sonner';

export function useCreateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (name: string) => createCategory(name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Kategori berhasil dibuat.');
    },
    onError: () => toast.error('Gagal membuat kategori.'),
  });
}
