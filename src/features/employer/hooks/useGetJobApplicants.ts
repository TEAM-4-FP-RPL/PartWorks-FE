import { useQuery } from '@tanstack/react-query';
import { getJobApplicants } from '../api';

export function useGetJobApplicants(id?: string) {
  return useQuery({
    queryKey: ['job-applicants', id],
    queryFn: () => getJobApplicants(id),
    enabled: !!id,
  });
}
