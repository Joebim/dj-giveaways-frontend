import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { user, isAuthenticated } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect to admin login page
    return <Navigate to="/auth/admin/login" state={{ from: location }} replace />;
  }

  // Check if user is admin or super_admin
  if (user?.role !== 'admin' && user?.role !== 'super_admin') {
    // Redirect to home page if not admin
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default AdminRoute;

