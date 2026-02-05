import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '../schemas/auth.schema';
import type { LoginFormValues } from '../schemas/auth.schema';
import { loginUser } from '../../../app/api/auth.api';
import { Input } from '../../../app/components/Input';
import { Button } from '../../../app/components/Button';
import { Alert } from '../../../app/components/Alert';
import { useState } from 'react';
import { useAuth } from '../../../app/providers/AuthContext';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { LogIn, Mail, Lock } from 'lucide-react';

export const LoginForm = () => {
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setLoading(true);
    setApiError('');
    try {
      const res = await loginUser(data);
      login(res.accessToken, res.user);
      navigate(redirect || '/dashboard');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || 'Login failed. Please try again.';
        setApiError(message);
      } else {
        setApiError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 animate-slide-up">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back
        </h1>
        <p className="text-sm text-gray-600">
          Sign in to your account to continue
        </p>
      </div>

      {apiError && <Alert type="error" message={apiError} />}

      <div className="space-y-4">
        <div className="relative">
          <div className="absolute left-4 top-[42px] text-gray-400">
            <Mail className="w-5 h-5" />
          </div>
          <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
            className="pl-12"
            {...register('email')}
            error={errors.email?.message}
          />
        </div>

        <div className="relative">
          <div className="absolute left-4 top-[42px] text-gray-400">
            <Lock className="w-5 h-5" />
          </div>
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            className="pl-12"
            {...register('password')}
            error={errors.password?.message}
          />
        </div>
      </div>

      <Button type="submit" loading={loading} fullWidth size="lg">
        <LogIn className="w-5 h-5" />
        Sign in
      </Button>
    </form>
  );
};
