import type { ButtonHTMLAttributes } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../utils/cn';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export const Button = ({
  loading,
  disabled,
  children,
  className,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  ...props
}: ButtonProps) => {
  const baseClasses = 'inline-flex items-center justify-center rounded-xl font-semibold smooth-transition disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500';

  const variantClasses = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700',
    secondary: 'bg-slate-800 text-white hover:bg-slate-900',
    outline: 'border border-slate-200 text-slate-700 hover:bg-slate-50',
    ghost: 'text-slate-600 hover:bg-slate-100',
    danger: 'bg-red-600 text-white hover:bg-red-700',
  };

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm gap-2',
    md: 'px-6 py-3 text-base gap-2',
    lg: 'px-8 py-4 text-lg gap-3',
  };

  return (
    <button
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        fullWidth && 'w-full',
        className
      )}
      disabled={loading || disabled}
      {...props}
    >
      {loading ? (
        <>
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Loading...</span>
        </>
      ) : (
        children
      )}
    </button>
  );
};
