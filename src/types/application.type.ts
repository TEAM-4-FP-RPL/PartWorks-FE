export type AppStatus = 'sent' | 'viewed' | 'called';

export interface Application {
  id: string;
  jobId: string;
  seekerName: string;
  seekerSkills: string[];
  seekerAvailability: string;
  status: AppStatus;
  appliedAt: string;
}
