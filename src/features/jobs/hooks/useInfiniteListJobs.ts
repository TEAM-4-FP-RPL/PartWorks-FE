import { useInfiniteQuery } from '@tanstack/react-query';
import { getJobs } from '../api';

export function useInfiniteListJobs(params: {
  type?: string;
  search?: string;
  location?: string;
  category_id?: number | string;
  limit?: number;
}) {
  return useInfiniteQuery({
    queryKey: ['jobs-infinite', params],
    queryFn: ({ pageParam = 1 }) => getJobs({ ...params, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { page, limit, total } = lastPage.meta;
      return page * limit < total ? page + 1 : undefined;
    },
  });
}
