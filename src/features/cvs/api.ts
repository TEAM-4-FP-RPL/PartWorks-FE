import { api } from '@/lib/axios';

export async function createCVs(formData: FormData) {
  const { data } = await api.post('/worker/cvs', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return data;
}

export async function updateCVs(formData: FormData) {
  const { data } = await api.patch('/worker/cvs', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return data;
}

export async function deleteCVs(payload: Record<string, string>) {
  const { data } = await api.delete('/worker/cvs', {
    data: payload,
  });
  return data;
}
