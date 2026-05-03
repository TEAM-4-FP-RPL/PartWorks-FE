import { api } from '@/lib/axios';

export async function applyJob(
  jobId: string,
  payload: { cv_id: string; cover_note: string }
) {
  const { data } = await api.post(`/jobs/${jobId}/apply`, payload);
  return data;
}
