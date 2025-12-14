import type { HTMLAttributes } from 'react';

const badgeVariants = {
  success: 'bg-green-100 text-green-800',
  inactive: 'bg-gray-100 text-gray-600',
  warning: 'bg-yellow-100 text-yellow-800',
  danger: 'bg-red-100 text-red-800',
} as const;

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: keyof typeof badgeVariants;
}

export const Badge = ({
  variant = 'inactive',
  className = '',
  children,
  ...props
}: BadgeProps) => {
  const baseStyles =
    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium';
  const variantStyles = badgeVariants[variant];

  return (
    <span className={`${baseStyles} ${variantStyles} ${className}`} {...props}>
      {children}
    </span>
  );
};
