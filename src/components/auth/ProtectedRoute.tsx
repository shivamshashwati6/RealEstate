import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import type { UserRole } from '../../types';

interface ProtectedRouteProps {
  allowedRoles?: UserRole[];
  children?: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles, children }) => {
  const { currentUser } = useAuthStore();

  // If no user is logged in or user is suspended
  if (!currentUser || currentUser.isSuspended) {
    return <Navigate to="/auth/login" replace />;
  }

  // Role enforcement
  if (allowedRoles && allowedRoles.length > 0) {
    if (!allowedRoles.includes(currentUser.role)) {
      // Bounce to assigned role dashboard
      const roleDashboardMap: Record<UserRole, string> = {
        buyer: '/dashboard/buyer',
        seller: '/dashboard/seller',
        admin: '/dashboard/admin',
      };

      const targetPath = roleDashboardMap[currentUser.role] || '/dashboard/buyer';
      return <Navigate to={targetPath} replace />;
    }
  }

  return children ? <>{children}</> : <Outlet />;
};
