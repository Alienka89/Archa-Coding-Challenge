import { memo } from 'react';
import type { ExpenseCode } from '@/types';
import { Card, Badge } from '@/components/ui';
import { EditButton } from '@/components/ui/EditButton';
import { getActiveStatusBadge } from '@/lib/utils';

export interface ExpenseCodeCardProps {
  code: ExpenseCode;
  onEdit?: () => void;
}

const ExpenseCodeCardComponent = ({ code, onEdit }: ExpenseCodeCardProps) => {
  const { variant: badgeVariant, text: badgeText } = getActiveStatusBadge(code.is_active);
  const descriptionText = code.description || 'No description';

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit?.();
  };

  return (
    <Card className="space-y-2">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <h4 className="text-base font-semibold text-white">{code.code}</h4>
          <p className="text-sm text-gray-400 mt-1">{descriptionText}</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={badgeVariant}>{badgeText}</Badge>
          {onEdit && <EditButton onClick={handleEditClick} ariaLabel="Edit code" />}
        </div>
      </div>
    </Card>
  );
};

export const ExpenseCodeCard = memo(ExpenseCodeCardComponent);
