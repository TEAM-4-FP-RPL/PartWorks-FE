import { useQuery } from '@tanstack/react-query';
import { getApplications } from '../api';

export default function useGetApplications() {
  return useQuery({
    queryKey: ['applications'],
    queryFn: getApplications,
  });
}
