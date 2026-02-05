import React from 'react';
import ReactDOM from 'react-dom';
import { AlertTriangle, X } from 'lucide-react';
import { Button } from './Button';

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    variant?: 'danger' | 'warning' | 'primary';
    loading?: boolean;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmLabel = 'Confirm',
    cancelLabel = 'Cancel',
    variant = 'danger',
    loading = false,
}) => {
    if (!isOpen) return null;

    const getVariantStyles = () => {
        switch (variant) {
            case 'danger':
                return {
                    iconBg: 'bg-red-50',
                    iconColor: 'text-red-600',
                    confirmBtn: 'bg-red-600 hover:bg-red-700 shadow-red-100',
                };
            case 'warning':
                return {
                    iconBg: 'bg-amber-50',
                    iconColor: 'text-amber-600',
                    confirmBtn: 'bg-amber-600 hover:bg-amber-700 shadow-amber-100',
                };
            default:
                return {
                    iconBg: 'bg-primary-50',
                    iconColor: 'text-primary-600',
                    confirmBtn: 'bg-primary-600 hover:bg-primary-700 shadow-primary-100',
                };
        }
    };

    const styles = getVariantStyles();

    if (!isOpen) return null;

    return ReactDOM.createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div
                className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-300"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-8">
                    <div className="flex items-center justify-between mb-6">
                        <div className={`p-3 ${styles.iconBg} rounded-2xl ${styles.iconColor}`}>
                            <AlertTriangle className="w-6 h-6" />
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-xl smooth-transition"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <h3 className="text-2xl font-black text-slate-900 mb-3 tracking-tight">
                        {title}
                    </h3>
                    <p className="text-slate-500 font-medium leading-relaxed">
                        {message}
                    </p>
                </div>

                <div className="px-8 py-6 bg-slate-50 border-t border-slate-100 flex items-center gap-3">
                    <Button
                        variant="ghost"
                        className="flex-1 rounded-xl font-bold"
                        onClick={onClose}
                        disabled={loading}
                    >
                        {cancelLabel}
                    </Button>
                    <Button
                        className={`flex-1 rounded-xl font-bold text-white shadow-lg ${styles.confirmBtn}`}
                        onClick={onConfirm}
                        loading={loading}
                    >
                        {confirmLabel}
                    </Button>
                </div>
            </div>
        </div>,
        document.body
    );
};
