import { api } from '@/lib/axios';

export async function registerUser() {
  const res = await api.post('/auth/register');
  return res.data;
}
