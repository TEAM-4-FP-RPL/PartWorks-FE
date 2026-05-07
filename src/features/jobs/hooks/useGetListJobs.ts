import { useQuery } from '@tanstack/react-query';
import { getJobs } from '../api';

export function useGetListJobs(params: {
  type?: string;
  page?: number;
  search?: string;
  location?: string;
  category_id?: number | string;
}) {
  return useQuery({
    queryKey: ['jobs', params],
    queryFn: () => getJobs(params),
  });
}
