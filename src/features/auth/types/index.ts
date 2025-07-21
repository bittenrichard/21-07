export interface User {
  id: string;
  name: string;
  email: string;
  company: string;
  avatar: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}