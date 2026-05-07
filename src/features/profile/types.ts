import { WorkerCV } from '@/features/cvs/types';

// Worker Interfaces
export interface WorkerProfileData {
  id: string;
  full_name: string;
  phone_number: string;
  bio: string;
  skills: string;
  photo_url: string;
  availabilities: WorkerAvailabilityData[];
  cvs: WorkerCV[];
}

export interface WorkerAvailabilityData {
  day: string;
  start_time: string;
  end_time: string;
}

export interface WorkerProfilePayload {
  full_name: string;
  phone_number?: string;
  bio: string;
  skills: string;
  photo?: File;
}

// Employer Interfaces
export interface EmployerProfileData {
  id: string;
  company_name: string;
  description: string;
  logo_url: string;
}

export interface EmployerProfilePayload {
  company_name: string;
  description: string;
  logo?: File;
}
