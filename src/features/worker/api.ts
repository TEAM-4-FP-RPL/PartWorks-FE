import { api } from '@/lib/axios';

export async function getApplications() {
  const res = await api.get('/worker/applications');
  return res.data.data;
}
