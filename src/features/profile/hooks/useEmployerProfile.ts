import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getEmployerProfile, updateEmployerProfile } from '../api';
import { EmployerProfilePayload } from '../types';
import { toast } from 'sonner';

export const useEmployerProfile = () => {
  return useQuery({
    queryKey: ['employerProfile'],
    queryFn: getEmployerProfile,
  });
};

export const useUpdateEmployerProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: EmployerProfilePayload) =>
      updateEmployerProfile(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employerProfile'] });
      toast.success('Profil perusahaan berhasil diperbarui.');
    },
    onError: () => toast.error('Gagal memperbarui profil perusahaan.'),
  });
};
