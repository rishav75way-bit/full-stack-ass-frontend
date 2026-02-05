import type { ReactNode } from 'react';
import { cn } from '../utils/cn';

interface SidebarProps {
  children: ReactNode;
  className?: string;
}

export const Sidebar = ({ children, className }: SidebarProps) => {
  return (
    <div
      className={cn(
        'w-72 bg-white/50 backdrop-blur-md border-r border-white/20 flex flex-col h-full animate-fade-in custom-scrollbar overflow-y-auto shadow-[1px_0_0_0_rgba(0,0,0,0.05)]',
        className
      )}
    >
      {children}
    </div>
  );
};
