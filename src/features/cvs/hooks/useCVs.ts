import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createCVs, updateCVs, deleteCVs } from '../api';
import { toast } from 'sonner';

export const useCreateCVs = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createCVs,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workerProfile'] });
      toast.success('CV berhasil diunggah.');
    },
    onError: () => toast.error('Gagal mengunggah CV.'),
  });
};

export const useUpdateCVs = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateCVs,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workerProfile'] });
      toast.success('CV berhasil diperbarui.');
    },
    onError: () => toast.error('Gagal memperbarui CV.'),
  });
};

export const useDeleteCVs = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteCVs,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workerProfile'] });
      toast.success('CV berhasil dihapus.');
    },
    onError: () => toast.error('Gagal menghapus CV.'),
  });
};
