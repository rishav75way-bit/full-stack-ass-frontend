import { useEffect, useState } from 'react';
import { googleLogin } from '../../../app/api/auth.api';
import { env } from '../../../app/config/env';
import { useAuth } from '../../../app/providers/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Alert } from '../../../app/components/Alert';

declare global {
  interface Window {
    google: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential: string }) => void;
          }) => void;
          renderButton: (
            element: HTMLElement | null,
            options: object
          ) => void;
        };
      };
    };
  }
}

export const GoogleLoginButton = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  useEffect(() => {
    const initializeGoogleLogin = () => {
      if (!window.google?.accounts?.id) {
        setTimeout(initializeGoogleLogin, 100);
        return;
      }

      window.google.accounts.id.initialize({
        client_id: env.GOOGLE_CLIENT_ID,
        callback: async (response) => {
          try {
            setError('');
            const res = await googleLogin({
              idToken: response.credential,
            });
            login(res.accessToken, res.user);
            navigate('/dashboard');
          } catch (err) {
            setError('Google login failed. Please try again.');
          }
        },
      });

      window.google.accounts.id.renderButton(
        document.getElementById('google-btn'),
        { theme: 'outline', size: 'large' }
      );
    };

    initializeGoogleLogin();
  }, [login, navigate]);

  return (
    <div className="mt-6">
      {error && <Alert type="error" message={error} />}
      <div className="flex justify-center mt-4">
        <div id="google-btn"></div>
      </div>
    </div>
  );
};
