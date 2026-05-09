import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getWorkerProfile, updateWorkerProfile } from '../api';
import { WorkerProfilePayload } from '../types';
import { toast } from 'sonner';

export const useWorkerProfile = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ['workerProfile'],
    queryFn: getWorkerProfile,
    enabled: options?.enabled ?? true,
  });
};

export const useUpdateWorkerProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: WorkerProfilePayload) => updateWorkerProfile(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workerProfile'] });
      toast.success('Profil berhasil diperbarui.');
    },
    onError: () => toast.error('Gagal memperbarui profil.'),
  });
};
