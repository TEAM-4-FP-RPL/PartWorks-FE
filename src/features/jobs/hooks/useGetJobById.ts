import { useQuery } from '@tanstack/react-query';
import { getJobById } from '../api';

export const useGetJobById = (id: string) => {
  return useQuery({
    queryKey: ['job', id],
    queryFn: () => getJobById(id),
    enabled: !!id,
  });
};
