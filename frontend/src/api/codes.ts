import { apiClient } from '@/lib/api-client';
import type { ExpenseCode, CreateExpenseCodeDto, UpdateExpenseCodeDto } from '@/types';

export const getCategoryCodes = async (categoryId: number): Promise<ExpenseCode[]> => {
  const { data } = await apiClient.get<ExpenseCode[]>(`/categories/${categoryId}/codes`);
  return data;
};

export const createCode = async (
  categoryId: number,
  dto: CreateExpenseCodeDto
): Promise<ExpenseCode> => {
  const { data } = await apiClient.post<ExpenseCode>(
    `/categories/${categoryId}/codes`,
    dto
  );
  return data;
};

export const updateCode = async (
  codeId: number,
  dto: UpdateExpenseCodeDto
): Promise<ExpenseCode> => {
  const { data } = await apiClient.put<ExpenseCode>(`/codes/${codeId}`, dto);
  return data;
};
