import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getEmployerJobs, deleteJob, updateJobStatus } from '../api';

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

export const useUpdateJobStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: 'open' | 'closed' }) =>
      updateJobStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employerJobs'] });
    },
  });
};
