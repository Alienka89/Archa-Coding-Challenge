import { useState, useCallback } from 'react';
import type { ExpenseCode } from '@/types';
import { useExpenseCodes } from '@/hooks/useExpenseCodes';
import { ExpenseCodeCard } from './ExpenseCodeCard';
import { EditCodeCard } from './EditCodeCard';
import { Skeleton } from '@/components/ui';
import { useErrorMessage } from '@/hooks/useErrorMessage';
import { ERROR_MESSAGES } from '@/lib/constants';

export interface ExpenseCodeListProps {
  categoryId: number | null;
}

export const ExpenseCodeList = ({ categoryId }: ExpenseCodeListProps) => {
  const { data: codes, isLoading, error } = useExpenseCodes(categoryId);
  const [editingCodeId, setEditingCodeId] = useState<number | null>(null);

  const errorMessage = useErrorMessage(error, ERROR_MESSAGES.LOAD_CODES_FAILED);

  const handleCancelEdit = useCallback(() => setEditingCodeId(null), []);
  const handleEdit = useCallback((codeId: number) => setEditingCodeId(codeId), []);

  const isNoCategorySelected = categoryId === null;
  const isEmpty = !isNoCategorySelected && !isLoading && codes?.length === 0;
  const hasError = !isNoCategorySelected && !isLoading && error;
  const hasData =
    !isNoCategorySelected && !isLoading && !error && codes && codes.length > 0;

  if (isNoCategorySelected) {
    return (
      <div className="bg-dark-surface/50 border border-dark-border rounded-xl p-12 text-center">
        <p className="text-gray-400">Select a category to view codes</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, index) => (
          <Skeleton
            key={index}
            className="min-h-20 rounded-xl border border-dark-border p-5"
          />
        ))}
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="bg-dark-surface/50 border border-red-500/30 rounded-xl p-8 text-center">
        <p className="text-red-400">{errorMessage}</p>
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className="bg-dark-surface/50 border border-dark-border rounded-xl p-12 text-center">
        <p className="text-gray-400">No codes found for this category</p>
      </div>
    );
  }

  if (hasData) {
    return (
      <div className="space-y-4">
        {codes.map((code: ExpenseCode) => {
          const isEditing = editingCodeId === code.id;

          if (isEditing) {
            return <EditCodeCard key={code.id} code={code} onCancel={handleCancelEdit} />;
          }

          return (
            <ExpenseCodeCard
              key={code.id}
              code={code}
              onEdit={() => handleEdit(code.id)}
            />
          );
        })}
      </div>
    );
  }

  return null;
};
