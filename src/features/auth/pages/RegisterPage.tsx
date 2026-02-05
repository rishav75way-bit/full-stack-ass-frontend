import { AuthLayout } from '../../../app/layouts/AuthLayout';
import { RegisterForm } from '../components/RegisterForm';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export const RegisterPage = () => {
  return (
    <AuthLayout>
      <RegisterForm />
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Already have an account?{' '}
          <Link
            to="/"
            className="font-semibold text-transparent bg-gradient-primary bg-clip-text hover:underline inline-flex items-center gap-1 group"
          >
            <ArrowLeft className="w-4 h-4 text-primary-600 group-hover:-translate-x-1 transition-transform" />
            Sign in
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};
