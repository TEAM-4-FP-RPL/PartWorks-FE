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

export interface EmployerJob {
  id: string;
  title: string;
  description: string;
  type: string;
  status: string;
  salary: number;
  location: string;
  category: {
    id: number;
    name: string;
  };
  employer: {
    id: string;
    company_name: string;
    logo_url: string;
  };
  total_applicants: number;
  schedules: {
    day: string;
    start_time: string;
    end_time: string;
  }[];
  work_hours_per_week: number;
  created_at: string;
}

export interface JobsResponse {
  data: EmployerJob[];
  meta: {
    limit: number;
    page: number;
    total: number;
  };
}

export async function getEmployerJobs(params: {
  status?: string;
  page?: number;
  limit?: number;
}) {
  const { data } = await api.get<JobsResponse>('/employer/jobs', { params });
  return data;
}

export async function getJobById(id: string) {
  const { data } = await api.get<{ data: EmployerJob }>(`/jobs/${id}`);
  return data.data;
}
