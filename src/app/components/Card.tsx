import type { ReactNode, CSSProperties } from 'react';
import { cn } from '../utils/cn';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
  style?: CSSProperties;
}

export const Card = ({ children, className, hover = false, onClick, style }: CardProps) => {
  return (
    <div
      onClick={onClick}
      style={style}
      className={cn(
        'card p-6 overflow-hidden relative',
        hover && 'hover:border-primary-300 cursor-pointer group',
        className
      )}
    >
      {}

      {children}
    </div>
  );
};
