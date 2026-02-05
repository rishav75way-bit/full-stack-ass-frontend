import { Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useAuth } from '../providers/AuthContext';

export const PublicRoute = ({ children }: { children: ReactNode }) => {
    const { isAuthenticated } = useAuth();

    if (isAuthenticated) {
        return <Navigate to="/dashboard" replace />;
    }

    return <>{children}</>;
};
