import { api } from '@/lib/axios';
import { RegisterFormValues } from './schemas';

export async function registerUser(data: RegisterFormValues) {
  const res = await api.post('/auth/register', data);
  return res.data;
}
