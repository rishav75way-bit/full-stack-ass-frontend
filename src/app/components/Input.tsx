import type { InputHTMLAttributes } from 'react';
import { cn } from '../utils/cn';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const Input = ({ label, error, className, ...props }: InputProps) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-semibold text-gray-700">
        {label}
      </label>

      <input
        {...props}
        className={cn(
          'w-full rounded-xl border-2 border-gray-200 bg-white/50 px-4 py-3 text-sm font-medium text-gray-900 placeholder:text-gray-400',
          'smooth-transition',
          'focus:border-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-100 focus:bg-white',
          'hover:border-gray-300',
          error && 'border-red-300 focus:border-red-500 focus:ring-red-100',
          className
        )}
      />

      {error && (
        <p className="text-xs font-medium text-red-600 flex items-center gap-1 animate-slide-down">
          <span className="inline-block w-1 h-1 rounded-full bg-red-600"></span>
          {error}
        </p>
      )}
    </div>
  );
};
