import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

import type { UserRole } from '../../types';

type ProtectedRouteProps = {
  allowedRoles?: UserRole[];
  redirectTo?: string;
};

export const ProtectedRoute = ({
  allowedRoles = [],
  redirectTo = '/login',
}: ProtectedRouteProps) => {
  const { user } = useAuth();
  
  console.log('🛡️ ProtectedRoute check - User:', user);
  console.log('🛡️ Allowed roles:', allowedRoles);

  if (!user) {
    console.log('❌ No user found, redirecting to:', redirectTo);
    return <Navigate to={redirectTo} replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    console.log('❌ User role not allowed. User role:', user.role, 'Allowed:', allowedRoles);
    return <Navigate to="/unauthorized" replace />;
  }

  console.log('✅ ProtectedRoute passed');
  return <Outlet />;
};

export const AdminRoute = () => (
  <ProtectedRoute allowedRoles={['owner']} redirectTo="/login" />
);

export const StaffRoute = () => (
  <ProtectedRoute allowedRoles={['staff']} redirectTo="/login" />
);

export const CustomerRoute = () => (
  <ProtectedRoute redirectTo="/login" />
);
