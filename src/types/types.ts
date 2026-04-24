export type JobCategory = 'Retail' | 'F&B' | 'Remote' | 'Logistik' | 'Admin';
export type Shift = 'morning' | 'afternoon' | 'evening' | 'weekend';
export type PayType = 'hourly' | 'daily';
export type Role = 'guest' | 'job_seeker' | 'employer';
export type AppStatus = 'sent' | 'viewed' | 'called';

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

export interface Application {
  id: string;
  jobId: string;
  seekerName: string;
  seekerSkills: string[];
  seekerAvailability: string;
  status: AppStatus;
  appliedAt: string;
}

export const CATEGORIES: JobCategory[] = [
  'Retail',
  'F&B',
  'Remote',
  'Logistik',
  'Admin',
];
export const SHIFTS: { value: Shift; label: string }[] = [
  { value: 'morning', label: 'Pagi' },
  { value: 'afternoon', label: 'Siang' },
  { value: 'evening', label: 'Malam' },
  { value: 'weekend', label: 'Weekend' },
];
export const DAYS = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];
