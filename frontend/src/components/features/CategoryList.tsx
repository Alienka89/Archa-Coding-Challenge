import { useState, useCallback } from 'react';
import { useCategories } from '@/hooks/useCategories';
import { CategoryCard } from './CategoryCard';
import { EditCategoryCard } from './EditCategoryCard';
import { Skeleton } from '@/components/ui';
import { useErrorMessage } from '@/hooks/useErrorMessage';
import { ERROR_MESSAGES } from '@/lib/constants';

export interface CategoryListProps {
  selectedCategoryId?: number | null;
  onCategorySelect?: (categoryId: number) => void;
}

export const CategoryList = ({
  selectedCategoryId,
  onCategorySelect,
}: CategoryListProps) => {
  const { data: categories, isLoading, error } = useCategories();
  const [editingCategoryId, setEditingCategoryId] = useState<number | null>(null);

  const errorMessage = useErrorMessage(error, ERROR_MESSAGES.LOAD_CATEGORIES_FAILED);

  const handleCancelEdit = useCallback(() => setEditingCategoryId(null), []);
  const handleEdit = useCallback(
    (categoryId: number) => setEditingCategoryId(categoryId),
    []
  );

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton
            key={index}
            className="min-h-[74px] rounded-xl border border-dark-border p-5"
          />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-400 mb-2">{errorMessage}</p>
      </div>
    );
  }

  if (!categories || categories.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-300">No categories found</p>
        <p className="text-gray-400 text-sm mt-1">
          Create your first category to get started
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {categories.map((category) => {
        const isEditing = editingCategoryId === category.id;

        if (isEditing) {
          return (
            <EditCategoryCard
              key={category.id}
              category={category}
              onCancel={handleCancelEdit}
            />
          );
        }

        return (
          <CategoryCard
            key={category.id}
            category={category}
            selected={selectedCategoryId === category.id}
            onClick={() => onCategorySelect?.(category.id)}
            onEdit={() => handleEdit(category.id)}
          />
        );
      })}
    </div>
  );
};
