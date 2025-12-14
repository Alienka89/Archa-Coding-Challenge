import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createCategory, updateCategory } from '@/api/categories';
import type { Category, CreateCategoryDto, UpdateCategoryDto } from '@/types';
import { QUERY_KEYS } from '@/lib/constants';

export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: CreateCategoryDto) => createCategory(dto),
    onMutate: async (newCategory) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.CATEGORIES });

      const previousCategories = queryClient.getQueryData<Category[]>(
        QUERY_KEYS.CATEGORIES
      );

      queryClient.setQueryData<Category[]>(QUERY_KEYS.CATEGORIES, (old) => {
        const optimisticCategory: Category = {
          id: Date.now(),
          name: newCategory.name,
          is_active: true,
        };
        return old ? [...old, optimisticCategory] : [optimisticCategory];
      });

      return { previousCategories };
    },
    onError: (_err, _newCategory, context) => {
      if (context?.previousCategories) {
        queryClient.setQueryData(QUERY_KEYS.CATEGORIES, context.previousCategories);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CATEGORIES });
    },
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, dto }: { id: number; dto: UpdateCategoryDto }) =>
      updateCategory(id, dto),
    onMutate: async ({ id, dto }) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.CATEGORIES });

      const previousCategories = queryClient.getQueryData<Category[]>(
        QUERY_KEYS.CATEGORIES
      );

      queryClient.setQueryData<Category[]>(QUERY_KEYS.CATEGORIES, (old) => {
        if (!old) return old;
        return old.map((category) =>
          category.id === id ? { ...category, ...dto } : category
        );
      });

      return { previousCategories };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousCategories) {
        queryClient.setQueryData(QUERY_KEYS.CATEGORIES, context.previousCategories);
      }
    },
    onSettled: (_data, _error, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CATEGORIES });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.EXPENSE_CODES(variables.id),
      });
    },
  });
};
