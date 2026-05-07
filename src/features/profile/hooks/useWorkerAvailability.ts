import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getWorkerAvailability, updateWorkerAvailability } from '../api';

export const useWorkerAvailability = () => {
  return useQuery({
    queryKey: ['workerAvailability'],
    queryFn: getWorkerAvailability,
  });
};

export const useUpdateWorkerAvailability = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateWorkerAvailability,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workerAvailability'] });
    },
  });
};
