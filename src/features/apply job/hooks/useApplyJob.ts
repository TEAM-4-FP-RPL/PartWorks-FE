import { useMutation } from '@tanstack/react-query';
import { applyJob } from '../api';
import { toast } from 'sonner';

export const useApplyJob = () => {
  return useMutation({
    mutationFn: ({
      jobId,
      payload,
    }: {
      jobId: string;
      payload: { cv_id: string; cover_note: string };
    }) => applyJob(jobId, payload),
    onSuccess: () => toast.success('Lamaran berhasil dikirim!'),
    onError: () => toast.error('Gagal mengirim lamaran.'),
  });
};
