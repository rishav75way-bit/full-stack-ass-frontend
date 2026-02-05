import { AuthLayout } from '../../../app/layouts/AuthLayout';
import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { api } from '../../../app/api/axios';
import { VerificationStatus } from '../components/VerificationStatus';

export const VerifyEmailPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState('Verifying your email...');

    useEffect(() => {
        const verifyEmail = async () => {
            const token = searchParams.get('token');
            const email = searchParams.get('email');

            if (!token || !email) {
                setStatus('error');
                setMessage('Invalid verification link');
                return;
            }

            try {
                await api.get(`/auth/verify-email?token=${token}&email=${email}`);
                setStatus('success');
                setMessage('Email verified successfully!');
                setTimeout(() => navigate('/'), 3000);
            } catch (error) {
                setStatus('error');
                setMessage('Verification failed. The link may be invalid or expired.');
            }
        };

        verifyEmail();
    }, [searchParams, navigate]);

    return (
        <AuthLayout>
            <div className="text-center py-4">
                <VerificationStatus
                    status={status}
                    message={message}
                    onNavigateToLogin={() => navigate('/')}
                />
            </div>
        </AuthLayout>
    );
};
