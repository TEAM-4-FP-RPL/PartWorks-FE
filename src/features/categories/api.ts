import { api } from '@/lib/axios';
import { CategoriesResponse } from './types';

export const getCategories = async (): Promise<CategoriesResponse> => {
  const { data } = await api.get<CategoriesResponse>('/categories');
  return data;
};
