import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import type { UserRole } from '../../types';

interface ProtectedRouteProps {
  requiredRole: UserRole;
  children?: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ requiredRole, children }) => {
  const { currentUser } = useAuthStore();
  const location = useLocation();

  if (!currentUser || currentUser.isSuspended) {
    return <Navigate to={`/auth/${requiredRole}/login`} state={{ from: location }} replace />;
  }

  if (currentUser.role !== requiredRole) {
    const defaultDashboards: Record<UserRole, string> = {
      buyer: '/dashboard/buyer',
      seller: '/dashboard/seller',
      admin: '/dashboard/admin',
    };

    return <Navigate to={defaultDashboards[currentUser.role] || '/dashboard/buyer'} replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};
