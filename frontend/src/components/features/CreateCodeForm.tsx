import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateCode } from '@/hooks/useCodeMutations';
import { useErrorMessage } from '@/hooks/useErrorMessage';
import { Input, FormActions, FormError } from '@/components/ui';
import { createCodeSchema, type CreateCodeFormData } from '@/lib/schemas';
import { ERROR_MESSAGES } from '@/lib/constants';

export interface CreateCodeFormProps {
  categoryId: number;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const CreateCodeForm = ({
  categoryId,
  onSuccess,
  onCancel,
}: CreateCodeFormProps) => {
  const { mutate: createCode, isPending, error } = useCreateCode();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateCodeFormData>({
    resolver: zodResolver(createCodeSchema),
    mode: 'onBlur',
    defaultValues: {
      code: '',
      description: '',
    },
  });

  const onSubmit = (data: CreateCodeFormData) => {
    createCode(
      { categoryId, dto: data },
      {
        onSuccess: () => {
          reset();
          onSuccess?.();
        },
      }
    );
  };

  const errorMessage = useErrorMessage(error, ERROR_MESSAGES.CREATE_CODE_FAILED);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Code"
        placeholder="Enter expense code"
        {...register('code')}
        error={errors.code?.message}
        disabled={isPending}
      />

      <Input
        label="Description (optional)"
        placeholder="Enter description"
        {...register('description')}
        disabled={isPending}
      />

      <FormError message={errorMessage} />

      <FormActions onCancel={onCancel} submitText="Create Code" isLoading={isPending} />
    </form>
  );
};
