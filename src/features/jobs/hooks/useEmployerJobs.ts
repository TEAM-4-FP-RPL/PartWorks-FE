import { useQuery } from '@tanstack/react-query';
import { getEmployerJobs } from '../api';

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
