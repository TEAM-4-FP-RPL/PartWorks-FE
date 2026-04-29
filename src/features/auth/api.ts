import { api } from '@/lib/axios';
import { LoginFormValues, RegisterFormValues } from './schemas';

export async function registerUser(data: RegisterFormValues) {
  const res = await api.post('/auth/register', data);
  return res.data;
}

export async function loginUser(data: LoginFormValues) {
  const res = await api.post('/auth/login', data);
  return res.data;
}
