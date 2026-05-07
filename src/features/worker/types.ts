export type Application = {
  id: string;
  status: string;
  cover_note: string;
  applied_at: string;
  cv: {
    id: string;
    file_url: string;
    category: {
      id: number;
      name: string;
    };
  };
  job: {
    id: number;
    title: string;
    type: string;
    location: string;
    employer: {
      company_name: string;
      logo_url: string;
    };
  };
};
