import { useQuery } from '@tanstack/react-query';
import { getCategoryCodes } from '@/api/codes';
import { QUERY_KEYS } from '@/lib/constants';

export const useExpenseCodes = (categoryId: number | null) => {
  return useQuery({
    queryKey:
      categoryId !== null
        ? QUERY_KEYS.EXPENSE_CODES(categoryId)
        : ['expense-codes', null],
    queryFn: () => {
      if (!categoryId) {
        return Promise.resolve([]);
      }
      return getCategoryCodes(categoryId);
    },
    enabled: categoryId !== null,
  });
};
