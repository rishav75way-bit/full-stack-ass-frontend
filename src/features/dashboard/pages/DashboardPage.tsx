import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const DashboardPage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        navigate('/workspaces');
    }, [navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center">
            <p className="text-gray-600">Redirecting to workspaces...</p>
        </div>
    );
};
