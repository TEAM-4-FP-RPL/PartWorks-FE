import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getJobApplicants, updateApplicationStatus } from '../api';
import { toast } from 'sonner';

export function useGetJobApplicants(id?: string) {
  return useQuery({
    queryKey: ['job-applicants', id],
    queryFn: () => getJobApplicants(id),
    enabled: !!id,
  });
}

export function useUpdateApplicationStatus(jobId?: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: string;
      status: 'accepted' | 'rejected';
    }) => updateApplicationStatus(id, status),
    onSuccess: (_, { status }) => {
      queryClient.invalidateQueries({ queryKey: ['job-applicants', jobId] });
      toast.success(
        status === 'accepted'
          ? 'Pelamar berhasil diterima.'
          : 'Pelamar berhasil ditolak.'
      );
    },
    onError: () => toast.error('Gagal memperbarui status pelamar.'),
  });
}
