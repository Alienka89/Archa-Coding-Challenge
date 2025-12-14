import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { ExpenseCode } from '@/types';
import { Card, Input, FormActions, FormError } from '@/components/ui';
import { Checkbox } from '@/components/ui/Checkbox';
import { useUpdateCode } from '@/hooks/useCodeMutations';
import { useErrorMessage } from '@/hooks/useErrorMessage';
import { updateCodeSchema, type UpdateCodeFormData } from '@/lib/schemas';
import { ERROR_MESSAGES } from '@/lib/constants';

export interface EditCodeCardProps {
  code: ExpenseCode;
  onCancel: () => void;
}

export const EditCodeCard = ({ code, onCancel }: EditCodeCardProps) => {
  const { mutate: updateCode, isPending, error } = useUpdateCode();

  const { register, handleSubmit } = useForm<UpdateCodeFormData>({
    resolver: zodResolver(updateCodeSchema),
    mode: 'onBlur',
    defaultValues: {
      description: code.description || '',
      is_active: code.is_active,
    },
  });

  const onSubmit = (data: UpdateCodeFormData) => {
    const dto = {
      description: data.description || undefined,
      is_active: data.is_active,
    };

    updateCode(
      { codeId: code.id, dto },
      {
        onSuccess: () => {
          onCancel();
        },
      }
    );
  };

  const errorMessage = useErrorMessage(error, ERROR_MESSAGES.UPDATE_CODE_FAILED);

  return (
    <Card className="border-blue-500">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <div>
          <p className="text-sm text-gray-400 mb-1">Code</p>
          <p className="text-base font-semibold text-white">{code.code}</p>
        </div>

        <Input
          placeholder="Description (optional)"
          {...register('description')}
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
