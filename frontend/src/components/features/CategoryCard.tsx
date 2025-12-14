import { memo } from 'react';
import type { Category } from '@/types';
import { Card, Badge } from '@/components/ui';
import { EditButton } from '@/components/ui/EditButton';
import { cn, getActiveStatusBadge } from '@/lib/utils';

export interface CategoryCardProps {
  category: Category;
  selected?: boolean;
  onClick?: () => void;
  onEdit?: () => void;
}

const CategoryCardComponent = ({
  category,
  selected = false,
  onClick,
  onEdit,
}: CategoryCardProps) => {
  const { variant: badgeVariant, text: badgeText } = getActiveStatusBadge(
    category.is_active
  );

  const handleCardClick = () => {
    onClick?.();
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit?.();
  };

  return (
    <Card
      hoverable
      onClick={handleCardClick}
      className={cn(
        'flex items-center justify-between gap-3',
        selected && 'border-blue-500 bg-dark-card-hover'
      )}
    >
      <h3 className="text-lg font-medium text-white flex-1">{category.name}</h3>
      <div className="flex items-center gap-2">
        <Badge variant={badgeVariant}>{badgeText}</Badge>
        {onEdit && <EditButton onClick={handleEditClick} ariaLabel="Edit category" />}
      </div>
    </Card>
  );
};

export const CategoryCard = memo(CategoryCardComponent);
