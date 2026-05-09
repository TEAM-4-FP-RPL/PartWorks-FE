import { useQuery } from '@tanstack/react-query';
import { getCategories } from '../api';

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
    select: (data) => ({
      ...data,
      data: [...(data?.data ?? [])].sort((a, b) =>
        a.name.localeCompare(b.name)
      ),
    }),
  });
};
