import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '../utils/cn';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  className?: string;
}

export const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  className,
}: ModalProps) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {}
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {}
      <div
        className={cn(
          'relative bg-white/90 backdrop-blur-xl rounded-3xl shadow-glass-lg border border-white/50 max-w-md w-full animate-scale-in max-h-[90vh] flex flex-col',
          className
        )}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 smooth-transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar">
          {children}
        </div>
      </div>
    </div>
  );
};
