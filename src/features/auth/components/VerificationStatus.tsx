import { Loader2, CheckCircle2, XCircle, ArrowRight } from 'lucide-react';
import { Button } from '../../../app/components/Button';
import { cn } from '../../../app/utils/cn';

interface VerificationStatusProps {
    status: 'loading' | 'success' | 'error';
    message: string;
    onNavigateToLogin: () => void;
}

export const VerificationStatus = ({ status, message, onNavigateToLogin }: VerificationStatusProps) => {
    return (
        <div className="flex flex-col items-center justify-center space-y-8 animate-fade-in">
            <div className={cn(
                "p-4 rounded-full smooth-transition",
                status === 'loading' && "bg-blue-50 text-blue-500",
                status === 'success' && "bg-emerald-50 text-emerald-500 shadow-glow shadow-emerald-200",
                status === 'error' && "bg-red-50 text-red-500 shadow-glow shadow-red-200"
            )}>
                {status === 'loading' && <Loader2 className="h-12 w-12 animate-spin" />}
                {status === 'success' && <CheckCircle2 className="h-12 w-12 animate-scale-in" />}
                {status === 'error' && <XCircle className="h-12 w-12 animate-scale-in" />}
            </div>

            <div className="text-center space-y-2">
                <p className={cn(
                    "text-lg font-bold transition-colors",
                    status === 'loading' && "text-blue-700",
                    status === 'success' && "text-emerald-700",
                    status === 'error' && "text-red-700"
                )}>
                    {message}
                </p>
                {status === 'loading' && (
                    <p className="text-sm text-gray-500 animate-pulse">
                        Verifying your email address...
                    </p>
                )}
            </div>

            {status !== 'loading' && (
                <Button
                    onClick={onNavigateToLogin}
                    fullWidth
                    size="lg"
                    className="mt-4"
                    variant={status === 'success' ? 'primary' : 'outline'}
                >
                    Return to Login
                    <ArrowRight className="w-5 h-5" />
                </Button>
            )}
        </div>
    );
};
