import React from 'react';
import LoginForm from './LoginForm';
import { LoginCredentials } from '../types';

interface LoginPageProps {
  onLogin: (credentials: LoginCredentials) => void;
  isLoading?: boolean;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin, isLoading }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-md">
        <div>
          <h2 className="text-center text-3xl font-bold text-gray-900">
            Recruta.<span className="text-indigo-600">AI</span>
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Faça login na sua conta para começar
          </p>
        </div>
        <LoginForm onSubmit={onLogin} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default LoginPage;