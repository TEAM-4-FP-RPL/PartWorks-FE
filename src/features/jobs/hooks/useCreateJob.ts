import { useMutation } from '@tanstack/react-query';
import { createJob } from '../api';
import { toast } from 'sonner';

export const useCreateJob = () => {
  return useMutation({
    mutationFn: createJob,
    onSuccess: () => toast.success('Lowongan berhasil dibuat.'),
    onError: () => toast.error('Gagal membuat lowongan.'),
  });
};
