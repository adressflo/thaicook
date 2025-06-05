// src/components/AdminRoute.tsx
import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const AdminRoute: React.FC = () => {
  const { currentUser, currentUserRole, isLoadingAuth, isLoadingUserRole } = useAuth();
  const location = useLocation();

  // Logs pour débogage
  console.log('[AdminRoute] isLoadingAuth:', isLoadingAuth);
  console.log('[AdminRoute] isLoadingUserRole:', isLoadingUserRole);
  console.log('[AdminRoute] currentUser:', currentUser?.uid);
  console.log('[AdminRoute] currentUserRole from context:', currentUserRole);

  if (isLoadingAuth || isLoadingUserRole) {
    console.log('[AdminRoute] Showing loading indicator...');
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-thai">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-thai-orange border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-thai-green font-medium">Vérification de l'accès...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    console.log('[AdminRoute] No current Firebase user, redirecting to /profil');
    return <Navigate to="/profil" state={{ from: location }} replace />;
  }

  if (currentUserRole !== 'admin') {
    console.log(`[AdminRoute] Role is "${currentUserRole}" (expected "admin"). Redirecting to /`);
    return <Navigate to="/" replace />;
  }

  console.log('[AdminRoute] User is admin, rendering Outlet.');
  return <Outlet />;
};

export default AdminRoute;