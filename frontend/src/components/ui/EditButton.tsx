import PencilIcon from '@/assets/icons/pencil.svg?react';

export interface EditButtonProps {
  onClick: (e: React.MouseEvent) => void;
  ariaLabel: string;
}

export const EditButton = ({ onClick, ariaLabel }: EditButtonProps) => {
  return (
    <button
      onClick={onClick}
      className="text-gray-400 hover:text-accent-blue transition-colors p-2 rounded-lg hover:bg-dark-card-hover cursor-pointer"
      aria-label={ariaLabel}
      title={ariaLabel}
      type="button"
    >
      <PencilIcon className="w-4 h-4" />
    </button>
  );
};
