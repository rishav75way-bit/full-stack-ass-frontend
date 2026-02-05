import { Loader2, Sparkles } from 'lucide-react';

export const Loading = () => (
  <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-6 animate-fade-in">
    <div className="relative">
      <div className="absolute inset-0 bg-primary-500 rounded-full blur-2xl opacity-20 animate-pulse"></div>
      <div className="bg-white p-6 rounded-[32px] shadow-glass relative ring-1 ring-slate-100">
        <Loader2 className="h-10 w-10 animate-spin text-primary-600" />
      </div>
      <Sparkles className="absolute -top-2 -right-2 h-6 w-6 text-amber-400 animate-bounce delay-300" />
    </div>

    <div className="text-center space-y-2">
      <h3 className="text-lg font-black text-slate-800 tracking-tight">Synchronizing WikiHub</h3>
      <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] animate-pulse">Initializing modern interface...</p>
    </div>
  </div>
);
