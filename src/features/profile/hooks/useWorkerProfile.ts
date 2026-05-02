import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getWorkerProfile, updateWorkerProfile } from '../api';
import { WorkerProfilePayload } from '../types';

export const useWorkerProfile = () => {
  return useQuery({
    queryKey: ['workerProfile'],
    queryFn: getWorkerProfile,
  });
};

export const useUpdateWorkerProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: WorkerProfilePayload) => updateWorkerProfile(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workerProfile'] });
    },
  });
};
