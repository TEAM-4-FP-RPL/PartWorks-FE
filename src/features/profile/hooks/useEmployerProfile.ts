import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getEmployerProfile,
  updateEmployerProfile,
  EmployerProfilePayload,
} from '../api';

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
