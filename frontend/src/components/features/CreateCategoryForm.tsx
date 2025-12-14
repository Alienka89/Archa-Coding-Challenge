import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input, FormActions, FormError } from '@/components/ui';
import { useCreateCategory } from '@/hooks/useCategoryMutations';
import { useErrorMessage } from '@/hooks/useErrorMessage';
import { createCategorySchema, type CreateCategoryFormData } from '@/lib/schemas';
import { ERROR_MESSAGES } from '@/lib/constants';

export interface CreateCategoryFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const CreateCategoryForm = ({ onSuccess, onCancel }: CreateCategoryFormProps) => {
  const { mutate: createCategory, isPending, error } = useCreateCategory();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateCategoryFormData>({
    resolver: zodResolver(createCategorySchema),
    mode: 'onBlur',
    defaultValues: {
      name: '',
    },
  });

  const onSubmit = (data: CreateCategoryFormData) => {
    createCategory(data, {
      onSuccess: () => {
        reset();
        onSuccess?.();
      },
    });
  };

  const errorMessage = useErrorMessage(error, ERROR_MESSAGES.CREATE_CATEGORY_FAILED);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Category Name"
        placeholder="Enter category name"
        {...register('name')}
        error={errors.name?.message}
        disabled={isPending}
      />

      <FormError message={errorMessage} />

      <FormActions
        onCancel={onCancel}
        submitText="Create Category"
        isLoading={isPending}
      />
    </form>
  );
};
