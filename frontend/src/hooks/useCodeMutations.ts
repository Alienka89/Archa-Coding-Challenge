import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createCode, updateCode } from '@/api/codes';
import type { CreateExpenseCodeDto, ExpenseCode, UpdateExpenseCodeDto } from '@/types';
import { QUERY_KEYS } from '@/lib/constants';

export const useCreateCode = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      categoryId,
      dto,
    }: {
      categoryId: number;
      dto: CreateExpenseCodeDto;
    }) => createCode(categoryId, dto),
    onMutate: async ({ categoryId, dto }) => {
      const queryKey = QUERY_KEYS.EXPENSE_CODES(categoryId);
      await queryClient.cancelQueries({ queryKey });

      const previousCodes = queryClient.getQueryData<ExpenseCode[]>(queryKey);

      queryClient.setQueryData<ExpenseCode[]>(queryKey, (old) => {
        const optimisticCode: ExpenseCode = {
          id: Date.now(),
          category_id: categoryId,
          code: dto.code,
          description: dto.description || null,
          is_active: true,
        };
        return old ? [...old, optimisticCode] : [optimisticCode];
      });

      return { previousCodes, categoryId };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousCodes && context.categoryId) {
        queryClient.setQueryData(
          QUERY_KEYS.EXPENSE_CODES(context.categoryId),
          context.previousCodes
        );
      }
    },
    onSettled: (_data, _error, variables) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.EXPENSE_CODES(variables.categoryId),
      });
    },
  });
};

export const useUpdateCode = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ codeId, dto }: { codeId: number; dto: UpdateExpenseCodeDto }) =>
      updateCode(codeId, dto),
    onMutate: async ({ codeId, dto }) => {
      const queries = queryClient.getQueryCache().findAll({
        predicate: (query) =>
          Array.isArray(query.queryKey) &&
          query.queryKey[0] === 'expense-codes' &&
          typeof query.queryKey[1] === 'number',
      });

      const snapshots: Array<{ queryKey: readonly unknown[]; data: ExpenseCode[] }> = [];

      for (const query of queries) {
        const data = query.state.data as ExpenseCode[] | undefined;
        if (!data) continue;

        const hasCode = data.some((code) => code.id === codeId);
        if (!hasCode) continue;

        await queryClient.cancelQueries({ queryKey: query.queryKey });
        snapshots.push({ queryKey: query.queryKey, data });

        queryClient.setQueryData<ExpenseCode[]>(query.queryKey, (old) => {
          if (!old) return old;
          return old.map((code) => (code.id === codeId ? { ...code, ...dto } : code));
        });
      }

      return { snapshots };
    },
    onError: (_err, _variables, context) => {
      if (context?.snapshots) {
        context.snapshots.forEach(({ queryKey, data }) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },
    onSettled: (data) => {
      if (data) {
        queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.EXPENSE_CODES(data.category_id),
        });
      }
    },
  });
};
