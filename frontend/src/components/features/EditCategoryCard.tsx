import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Category } from '@/types';
import { Card, Input, FormActions, FormError } from '@/components/ui';
import { Checkbox } from '@/components/ui/Checkbox';
import { useUpdateCategory } from '@/hooks/useCategoryMutations';
import { useErrorMessage } from '@/hooks/useErrorMessage';
import { updateCategorySchema, type UpdateCategoryFormData } from '@/lib/schemas';
import { ERROR_MESSAGES } from '@/lib/constants';

export interface EditCategoryCardProps {
  category: Category;
  onCancel: () => void;
}

export const EditCategoryCard = ({ category, onCancel }: EditCategoryCardProps) => {
  const { mutate: updateCategory, isPending, error } = useUpdateCategory();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateCategoryFormData>({
    resolver: zodResolver(updateCategorySchema),
    mode: 'onBlur',
    defaultValues: {
      name: category.name,
      is_active: category.is_active,
    },
  });

  const onSubmit = (data: UpdateCategoryFormData) => {
    updateCategory(
      { id: category.id, dto: data },
      {
        onSuccess: () => {
          onCancel();
        },
      }
    );
  };

  const errorMessage = useErrorMessage(error, ERROR_MESSAGES.UPDATE_CATEGORY_FAILED);

  return (
    <Card className="border-blue-500">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <Input
          placeholder="Category name"
          {...register('name')}
          error={errors.name?.message}
          disabled={isPending}
        />

        <Checkbox label="Active" {...register('is_active')} disabled={isPending} />

        <FormError message={errorMessage} />

        <FormActions
          onCancel={onCancel}
          submitText="Save"
          isLoading={isPending}
          size="sm"
        />
      </form>
    </Card>
  );
};
