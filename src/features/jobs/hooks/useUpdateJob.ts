import { useMutation } from '@tanstack/react-query';
import { updateJob } from '../api';
import { JobFormValues } from '../schemas';

export const useUpdateJob = () => {
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: JobFormValues }) =>
      updateJob(id, payload),
  });
};
