import type { TextareaHTMLAttributes } from 'react';
import { cn } from '../utils/cn';

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const TextArea = ({ label, error, className, ...props }: TextAreaProps) => {
  return (
    <div className="space-y-2 flex flex-col h-full">
      {label && (
        <label className="text-sm font-semibold text-gray-700">
          {label}
        </label>
      )}

      <textarea
        {...props}
        className={cn(
          'w-full flex-1 rounded-2xl border-2 border-gray-100 bg-white/50 px-5 py-4 text-sm font-medium text-gray-900 placeholder:text-gray-400',
          'smooth-transition custom-scrollbar',
          'focus:border-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-100 focus:bg-white',
          'hover:border-gray-200',
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
