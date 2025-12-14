import type { HTMLAttributes } from 'react';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
}

export const Card = ({
  hoverable = false,
  className = '',
  children,
  ...props
}: CardProps) => {
  const baseStyles =
    'bg-dark-card rounded-xl shadow-2xl border border-dark-border p-5 backdrop-blur-sm';
  const hoverStyles = hoverable
    ? 'hover:bg-dark-card-hover hover:border-dark-border-light hover:shadow-accent-blue-muted/10 hover:shadow-2xl transition-all duration-200 cursor-pointer'
    : '';

  return (
    <div className={`${baseStyles} ${hoverStyles} ${className}`} {...props}>
      {children}
    </div>
  );
};
