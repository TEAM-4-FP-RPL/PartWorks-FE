import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getEmployerProfile, updateEmployerProfile } from '../api';
import { EmployerProfilePayload } from '../types';

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
    },
  });
};
