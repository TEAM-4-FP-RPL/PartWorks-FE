import { useMutation } from '@tanstack/react-query';
import { applyJob } from '../api';

export const useApplyJob = () => {
  return useMutation({
    mutationFn: ({
      jobId,
      payload,
    }: {
      jobId: string;
      payload: { cv_id: string; cover_note: string };
    }) => applyJob(jobId, payload),
    onSuccess: () => {
      alert('Lamaran berhasil dikirim!');
    },
    onError: () => {
      alert('Gagal mengirim lamaran.');
    },
  });
};
