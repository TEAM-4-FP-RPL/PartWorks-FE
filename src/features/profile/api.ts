import { api } from '@/lib/axios';
import {
  EmployerProfilePayload,
  WorkerAvailabilityData,
  WorkerProfilePayload,
} from './types';

// Worker APIs
export async function getWorkerProfile() {
  const { data } = await api.get('/worker/profile');
  return data.data;
}

export async function updateWorkerProfile(payload: WorkerProfilePayload) {
  const formData = new FormData();
  formData.append('full_name', payload.full_name);
  formData.append('bio', payload.bio);
  formData.append('skills', payload.skills);
  if (payload.phone_number)
    formData.append('phone_number', payload.phone_number);
  if (payload.photo) formData.append('photo', payload.photo);

  const { data } = await api.patch('/worker/profile', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}

export async function getWorkerAvailability() {
  const { data } = await api.get('/worker/availability');
  return data.data;
}

export async function updateWorkerAvailability(
  payload: WorkerAvailabilityData[]
) {
  const { data } = await api.patch('/worker/availability', {
    availabilities: payload,
  });
  return data;
}

// Employer APIs
export async function getEmployerProfile() {
  const { data } = await api.get('/employer/profile');
  return data.data;
}

export async function updateEmployerProfile(payload: EmployerProfilePayload) {
  const formData = new FormData();
  formData.append('company_name', payload.company_name);
  formData.append('description', payload.description);
  if (payload.logo) formData.append('logo', payload.logo);

  const { data } = await api.patch('/employer/profile', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}
