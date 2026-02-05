import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema } from '../schemas/auth.schema';
import type { RegisterFormValues } from '../schemas/auth.schema';
import { registerUser } from '../../../app/api/auth.api';
import { Input } from '../../../app/components/Input';
import { Button } from '../../../app/components/Button';
import { Alert } from '../../../app/components/Alert';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserPlus, User, Mail, Lock, UserCheck } from 'lucide-react';

export const RegisterForm = () => {
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setLoading(true);
    setApiError('');
    setSuccess(false);
    try {
      await registerUser(data);
      setSuccess(true);
      setTimeout(() => navigate('/'), 3000);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || 'Registration failed. Please try again.';
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
          Create account
        </h1>
        <p className="text-sm text-gray-600">
          Join WikiHub to start collaborating
        </p>
      </div>

      {success && (
        <Alert
          type="success"
          message="Registration successful! Check your email to verify your account."
          subMessage="Redirecting to login..."
        />
      )}

      {apiError && <Alert type="error" message={apiError} />}

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="relative">
            <div className="absolute left-4 top-[42px] text-gray-400">
              <User className="w-5 h-5" />
            </div>
            <Input
              label="First Name"
              type="text"
              placeholder="John"
              className="pl-12"
              {...register('firstName')}
              error={errors.firstName?.message}
            />
          </div>

          <div className="relative">
            <div className="absolute left-4 top-[42px] text-gray-400">
              <UserCheck className="w-5 h-5" />
            </div>
            <Input
              label="Last Name"
              type="text"
              placeholder="Doe"
              className="pl-12"
              {...register('lastName')}
              error={errors.lastName?.message}
            />
          </div>
        </div>

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

      <Button type="submit" loading={loading} disabled={success} fullWidth size="lg">
        <UserPlus className="w-5 h-5" />
        Create Account
      </Button>
    </form>
  );
};
