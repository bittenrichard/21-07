import { useState } from 'react';
import { User, LoginCredentials } from '../types';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    
    // Simulação de login - em produção seria uma chamada à API
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockUser: User = {
      id: '1',
      name: 'Ana Recrutadora',
      email: credentials.email,
      company: 'Empresa Inc.',
      avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d'
    };
    
    setUser(mockUser);
    setIsLoading(false);
    return mockUser;
  };

  const logout = () => {
    setUser(null);
  };

  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout
  };
};