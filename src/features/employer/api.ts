import { api } from '@/lib/axios';

export async function getJobApplicants(id?: string) {
  const res = await api.get(`/employer/${id}/applications`);
  return res.data.data;
}
