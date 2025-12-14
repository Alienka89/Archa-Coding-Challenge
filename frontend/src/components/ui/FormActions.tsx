import { Button } from './Button';

export interface FormActionsProps {
  onCancel?: () => void;
  cancelText?: string;
  submitText: string;
  isLoading?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const FormActions = ({
  onCancel,
  cancelText = 'Cancel',
  submitText,
  isLoading = false,
  size = 'md',
}: FormActionsProps) => {
  return (
    <div className="flex gap-3 justify-end">
      {onCancel && (
        <Button type="button" variant="secondary" size={size} onClick={onCancel}>
          {cancelText}
        </Button>
      )}
      <Button type="submit" variant="primary" size={size} loading={isLoading}>
        {submitText}
      </Button>
    </div>
  );
};
