import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import api from '../services/api';

type UserRole = 'owner' | 'staff';

interface User {
  id: string;
  email: string;
  role: UserRole;
  name: string;
  token: string;
}

interface AuthContextType {
  user: User | null;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  logout: () => void;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Load user from localStorage on initial load
  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = localStorage.getItem('pos_so_token');
        const storedUser = localStorage.getItem('user');

        if (token && storedUser) {
          // Set auth header for subsequent requests
          const authToken = `Bearer ${token}`;
          api.defaults.headers.common['Authorization'] = authToken;

          try {
            const response = await authAPI.getMe();
            if (response.data.success) {
              const userData = response.data.data;

              // Ensure user role is valid
              const validRoles: UserRole[] = ['owner', 'staff'];
              if (!validRoles.includes(userData.role as UserRole)) {
                throw new Error('Invalid user role');
              }

              const typedUser: User = {
                ...userData,
                token,
                role: userData.role as UserRole
              };

              setUser(typedUser);
              localStorage.setItem('user', JSON.stringify(typedUser));
            } else {
              throw new Error('Session expired');
            }
          } catch (err) {
            console.error('Token validation failed:', err);
            throw err;
          }
        }
      } catch (err) {
        console.error('Authentication check failed:', err);
        // Clear invalid auth data
        localStorage.removeItem('pos_so_token');
        localStorage.removeItem('user');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (credentials: { email: string; password: string }) => {
    try {
      setLoading(true);
      setError(null);

      console.log('🔐 Login attempt started');
      const response = await authAPI.login(credentials);
      console.log('📥 Login response:', response);

      if (response.data.success) {
        const { token, user: userData } = response.data.data;
        console.log('✅ Login successful - Token:', token ? 'exists' : 'missing');
        console.log('👤 User data:', userData);

        // Ensure user role is valid
        const validRoles: UserRole[] = ['owner', 'staff'];
        if (!validRoles.includes(userData.role as UserRole)) {
          console.log('❌ Invalid role:', userData.role);
          throw new Error('Unauthorized access');
        }

        const user: User = {
          id: userData.id,
          email: userData.email,
          name: userData.name,
          role: userData.role as UserRole,
          token
        };

        console.log('🔧 Processed user object:', user);

        // Save token and user data
        localStorage.setItem('pos_so_token', token);
        localStorage.setItem('user', JSON.stringify(user));
        console.log('💾 Data saved to localStorage');

        // Set auth header for subsequent requests
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        console.log('🔐 Auth header set');

        setUser(user);
        console.log('👤 User state set in context');

        // Redirect based on role
        const redirectPath = user.role === 'owner' ? '/owner/dashboard' : '/staff/orders';
        console.log('🚀 Redirecting to:', redirectPath);
        navigate(redirectPath);
        console.log('✅ Navigate called');
      } else {
        console.log('❌ Login failed - response:', response.data);
        throw new Error(response.data.message || 'Login failed');
      }
    } catch (err: any) {
      console.error('💥 Login error:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Login failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    // Clear auth data
    localStorage.removeItem('pos_so_token');
    localStorage.removeItem('user');
    delete api.defaults.headers.common['Authorization'];

    setUser(null);
    navigate('/login');
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    loading,
    error,
    isAuthenticated: !!user
  };

  console.log('🔄 AuthContext value:', {
    user: user ? { id: user.id, email: user.email, role: user.role } : null,
    loading,
    isAuthenticated: !!user
  });

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};