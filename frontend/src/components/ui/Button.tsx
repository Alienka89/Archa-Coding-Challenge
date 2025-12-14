import { forwardRef, useMemo } from 'react';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import SpinnerIcon from '@/assets/icons/spinner.svg?react';

const buttonVariants = {
  primary:
    'bg-accent-blue text-white hover:bg-accent-blue-hover focus:ring-accent-blue shadow-lg shadow-accent-blue-muted/20',
  secondary:
    'bg-dark-card border border-dark-border-light text-gray-300 hover:bg-dark-card-hover hover:border-gray-500 focus:ring-accent-blue',
  danger: 'bg-red-600/90 text-white hover:bg-red-600 focus:ring-red-500 shadow-lg',
} as const;

const buttonSizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
} as const;

const BASE_STYLES =
  'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

const LOADING_CONTENT = (
  <>
    <SpinnerIcon className="mr-2 h-4 w-4 animate-spin" />
    Loading...
  </>
);

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof buttonVariants;
  size?: keyof typeof buttonSizes;
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      disabled,
      children,
      className = '',
      ...props
    },
    ref
  ) => {
    const buttonClassName = useMemo(() => {
      const variantStyles = buttonVariants[variant];
      const sizeStyles = buttonSizes[size];
      return `${BASE_STYLES} ${variantStyles} ${sizeStyles} ${className}`;
    }, [variant, size, className]);

    const buttonContent: ReactNode = loading ? LOADING_CONTENT : children;

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={buttonClassName}
        {...props}
      >
        {buttonContent}
      </button>
    );
  }
);

Button.displayName = 'Button';
