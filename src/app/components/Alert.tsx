import { AlertCircle, CheckCircle2, Info } from 'lucide-react';
import { cn } from '../utils/cn';

interface AlertProps {
    type: 'error' | 'success' | 'info';
    message: string;
    subMessage?: string;
    className?: string;
}

export const Alert = ({ type, message, subMessage, className }: AlertProps) => {
    const styles = {
        error: {
            container: 'bg-red-50/80 border-red-200 text-red-800',
            icon: AlertCircle,
            iconColor: 'text-red-600',
            glow: 'shadow-red-100',
        },
        success: {
            container: 'bg-emerald-50/80 border-emerald-200 text-emerald-800',
            icon: CheckCircle2,
            iconColor: 'text-emerald-600',
            glow: 'shadow-emerald-100',
        },
        info: {
            container: 'bg-blue-50/80 border-blue-200 text-blue-800',
            icon: Info,
            iconColor: 'text-blue-600',
            glow: 'shadow-blue-100',
        },
    };

    const style = styles[type];
    const Icon = style.icon;

    return (
        <div className={cn(
            'rounded-2xl p-4 border backdrop-blur-sm shadow-lg animate-scale-in',
            style.container,
            style.glow,
            className
        )}>
            <div className="flex items-start gap-4">
                <div className={cn('p-2 rounded-xl bg-white/50 shadow-sm', style.iconColor)}>
                    <Icon className="h-5 w-5 flex-shrink-0" />
                </div>
                <div className="flex-1 pt-1">
                    <p className="text-sm font-bold">{message}</p>
                    {subMessage && <p className="text-xs mt-1 font-medium opacity-80">{subMessage}</p>}
                </div>
            </div>
        </div>
    );
};
