import { useQuery } from '@tanstack/react-query';
import { getCategories } from '@/api/categories';
import { QUERY_KEYS } from '@/lib/constants';

export const useCategories = () => {
  return useQuery({
    queryKey: QUERY_KEYS.CATEGORIES,
    queryFn: getCategories,
  });
};
