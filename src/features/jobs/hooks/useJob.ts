import { useQuery } from '@tanstack/react-query';
import { getJobById } from '../api';

export const useJob = (id: string) => {
  return useQuery({
    queryKey: ['job', id],
    queryFn: () => getJobById(id),
    enabled: !!id,
  });
};
