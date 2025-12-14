import { forwardRef, useId } from 'react';
import type { InputHTMLAttributes } from 'react';

export interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, id: providedId, className = '', ...props }, ref) => {
    const generatedId = useId();
    const inputId = providedId || generatedId;

    return (
      <div className="flex items-center gap-2">
        <input
          ref={ref}
          type="checkbox"
          id={inputId}
          className={`w-4 h-4 text-blue-600 bg-dark-bg border-dark-border rounded focus:ring-blue-500 focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-card cursor-pointer ${className}`}
          {...props}
        />
        <label
          htmlFor={inputId}
          className="text-sm text-gray-300 cursor-pointer select-none"
        >
          {label}
        </label>
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';
