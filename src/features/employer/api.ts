import { api } from '@/lib/axios';

export async function getJobApplicants(id?: string) {
  const res = await api.get(`/employer/jobs/${id}/applications`);
  return res.data.data;
}

export async function updateApplicationStatus(
  id: string,
  status: 'accepted' | 'rejected'
) {
  const { data } = await api.patch(`/employer/jobs/${id}/applications`, {
    status,
  });
  return data;
}
