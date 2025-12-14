import { apiClient } from '@/lib/api-client';
import type { Category, CreateCategoryDto, UpdateCategoryDto } from '@/types';

export const getCategories = async (): Promise<Category[]> => {
  const { data } = await apiClient.get<Category[]>('/categories');
  return data;
};

export const createCategory = async (dto: CreateCategoryDto): Promise<Category> => {
  const { data } = await apiClient.post<Category>('/categories', dto);
  return data;
};

export const updateCategory = async (
  id: number,
  dto: UpdateCategoryDto
): Promise<Category> => {
  const { data } = await apiClient.put<Category>(`/categories/${id}`, dto);
  return data;
};
