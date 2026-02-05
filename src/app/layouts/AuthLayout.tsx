import type { ReactNode } from 'react';
import { Sparkles } from 'lucide-react';

interface AuthLayoutProps {
  children: ReactNode;
}

export const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-mesh p-4 relative overflow-hidden">
      {}
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse-slow"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse-slow animation-delay-2000"></div>
      <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse-slow animation-delay-4000"></div>

      {}
      <div className="w-full max-w-md relative z-10 animate-fade-in">
        {}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-glass-lg border border-white/20 p-8 sm:p-10">
          {}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-gradient-primary rounded-xl shadow-glow">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold gradient-text">WikiHub</h2>
            </div>
          </div>

          {children}
        </div>

        {}
        <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-primary rounded-full opacity-20 blur-2xl"></div>
        <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-secondary rounded-full opacity-20 blur-2xl"></div>
      </div>
    </div>
  );
};
