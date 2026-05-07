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
