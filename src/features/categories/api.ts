import { api } from '@/lib/axios';
import { CategoriesResponse } from './types';

export const getCategories = async (): Promise<CategoriesResponse> => {
  const { data } = await api.get<CategoriesResponse>('/categories');
  return data;
};

export const createCategory = async (name: string) => {
  const { data } = await api.post('/categories', { name });
  return data;
};
