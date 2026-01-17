import { Dispatch, SetStateAction } from 'react';

export interface User {
  id: string | number;
  name: string;
  email: string;
  role: 'customer' | 'staff' | 'owner';
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  register: (userData: {
    name: string;
    email: string;
    password: string;
    role?: 'customer' | 'staff' | 'owner';
  }) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  hasRole: (roles: string | string[]) => boolean;
  hasAnyRole: (roles: string[]) => boolean;
  setUser: Dispatch<SetStateAction<User | null>>;
}
