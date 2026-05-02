import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getEmployerJobs, deleteJob } from '../api';

interface UseEmployerJobsOptions {
  status?: string;
  page?: number;
  limit?: number;
}

export const useEmployerJobs = (options?: UseEmployerJobsOptions) => {
  return useQuery({
    queryKey: ['employerJobs', options],
    queryFn: () => getEmployerJobs(options || {}),
  });
};

export const useDeleteJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteJob(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employerJobs'] });
    },
  });
};
