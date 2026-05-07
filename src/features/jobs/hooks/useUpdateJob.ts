import { useMutation } from '@tanstack/react-query';
import { updateJob } from '../api';
import { JobFormValues } from '../schemas';
import { toast } from 'sonner';

export const useUpdateJob = () => {
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: JobFormValues }) =>
      updateJob(id, payload),
    onSuccess: () => toast.success('Lowongan berhasil diperbarui.'),
    onError: () => toast.error('Gagal memperbarui lowongan.'),
  });
};
