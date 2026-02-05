import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft, Search, Sparkles } from 'lucide-react';
import { Button } from '../app/components/Button';

export const NotFound = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-8 overflow-hidden relative">
            {}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-200/20 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-200/20 rounded-full blur-[120px] animate-pulse delay-700"></div>
            </div>

            <div className="text-center space-y-12 max-w-lg z-10 animate-fade-in">
                <div className="relative inline-block">
                    <span className="text-[180px] font-black text-slate-200 leading-none select-none">404</span>
                    <div className="absolute inset-0 flex items-center justify-center translate-y-4">
                        <div className="p-8 bg-white rounded-[40px] shadow-glass border border-white ring-1 ring-slate-100 flex flex-col items-center gap-2">
                            <Search className="w-12 h-12 text-primary-400" />
                        </div>
                    </div>
                    <Sparkles className="absolute -top-4 -right-4 w-12 h-12 text-amber-400 animate-bounce" />
                </div>

                <div className="space-y-4">
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">Lost in the <span className="gradient-text">Cloud?</span></h1>
                    <p className="text-slate-500 font-medium text-lg leading-relaxed">
                        The page you are looking for has either drifted away or never existed in this dimension.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
                    <Button
                        variant="outline"
                        size="lg"
                        onClick={() => navigate(-1)}
                        className="rounded-2xl border-2 border-slate-200 bg-white"
                    >
                        <ArrowLeft className="h-5 w-5 mr-2" />
                        Go Back
                    </Button>
                    <Button
                        size="lg"
                        onClick={() => navigate('/')}
                        className="rounded-2xl shadow-glow"
                    >
                        <Home className="h-5 w-5 mr-2" />
                        Back to Hub
                    </Button>
                </div>
            </div>
        </div>
    );
};
