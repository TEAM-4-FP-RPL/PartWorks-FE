import { api } from '@/lib/axios';
import { JobFormValues } from './schemas';

export async function createJob(payload: JobFormValues) {
  const { data } = await api.post('/jobs', payload);
  return data;
}

export async function updateJob(id: string, payload: JobFormValues) {
  const { data } = await api.patch(`/jobs/${id}`, payload);
  return data;
}

export async function deleteJob(id: string) {
  const { data } = await api.delete(`/jobs/${id}`);
  return data;
}

export async function getEmployerJobs(params: {
  status?: string;
  page?: number;
  limit?: number;
}) {
  const { data } = await api.get('/employer/jobs', { params });
  return data;
}

export async function getJobs(params: {
  type?: string;
  page?: number;
  search?: string;
  location?: string;
  category_id?: number | string;
}) {
  const { data } = await api.get('/jobs', { params });
  return data;
}

export async function getJobById(id: string) {
  const { data } = await api.get(`/jobs/${id}`);
  return data.data;
}
