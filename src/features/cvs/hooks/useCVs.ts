import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createCVs, updateCVs, deleteCVs } from '../api';

export const useCreateCVs = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCVs,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workerProfile'] });
    },
  });
};

export const useUpdateCVs = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateCVs,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workerProfile'] });
    },
  });
};

export const useDeleteCVs = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCVs,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workerProfile'] });
    },
  });
};
