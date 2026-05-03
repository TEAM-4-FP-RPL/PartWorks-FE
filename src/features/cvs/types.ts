import { Category } from '@/features/categories/types';

export interface WorkerCV {
  id: string;
  file_url: string;
  category: Category;
}

export interface BulkUpdateCVsPayload {
  formData: FormData;
}
