import { useMutation } from '@tanstack/react-query';
import { createJob } from '../api';

export interface CreateJobPayload {
  category_id: number;
  title: string;
  description: string;
  type: string;
  salary: number;
  location: string;
  schedules: {
    day: string;
    start_time: string;
    end_time: string;
  }[];
}

export const useCreateJob = () => {
  return useMutation({
    mutationFn: createJob,
  });
};
