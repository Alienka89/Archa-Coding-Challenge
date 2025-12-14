import { forwardRef, useId, useMemo } from 'react';
import type { InputHTMLAttributes } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const BASE_STYLES =
  'w-full px-3 py-2 border rounded-lg bg-dark-bg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors';

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', id: providedId, ...props }, ref) => {
    const generatedId = useId();
    const inputId = providedId || generatedId;

    const inputClassName = useMemo(() => {
      const errorStyles = error
        ? 'border-red-500 focus:ring-red-500'
        : 'border-dark-border';
      return `${BASE_STYLES} ${errorStyles} ${className}`;
    }, [error, className]);

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-gray-300 mb-1"
          >
            {label}
          </label>
        )}
        <input id={inputId} ref={ref} className={inputClassName} {...props} />
        {error && (
          <p className="mt-1 text-sm text-red-600" role="alert" aria-live="polite">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
