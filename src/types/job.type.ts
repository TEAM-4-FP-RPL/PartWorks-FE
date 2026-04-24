import { Shift } from '@/types/shift.type.';

export type JobCategory =
  | 'all'
  | 'Retail'
  | 'F&B'
  | 'Remote'
  | 'Logistik'
  | 'Admin';
export type PayType = 'hourly' | 'daily';
export type Role = 'guest' | 'job_seeker' | 'employer';

export interface Job {
  id: string;
  employerId: string;
  company: string;
  title: string;
  category: JobCategory;
  location: string;
  description: string;
  requirements: string[];
  payRate: number;
  payType: PayType;
  shifts: Shift[];
  duration: string;
  createdAt: string;
}

export const CATEGORIES: JobCategory[] = [
  'Retail',
  'F&B',
  'Remote',
  'Logistik',
  'Admin',
];
