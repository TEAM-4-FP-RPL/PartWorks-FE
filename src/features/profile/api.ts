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
  const { data } = await api.patch('/worker/profile', payload);
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
  const { data } = await api.patch('/employer/profile', payload);
  return data;
}
