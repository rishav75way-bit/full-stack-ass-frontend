import { AuthLayout } from '../../../app/layouts/AuthLayout';
import { LoginForm } from '../components/LoginForm';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export const LoginPage = () => {
  return (
    <AuthLayout>
      <LoginForm />
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Don't have an account?{' '}
          <Link
            to="/register"
            className="font-semibold text-transparent bg-gradient-primary bg-clip-text hover:underline inline-flex items-center gap-1 group"
          >
            Sign up
            <ArrowRight className="w-4 h-4 text-primary-600 group-hover:translate-x-1 transition-transform" />
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};
