'use client'

import { useAuth } from '@/contexts/AuthContext';
import { useClient } from '@/hooks/useSupabaseData';

// Hook pour vérifier les permissions
export const usePermissions = () => {
  const { currentUser, currentUserProfile } = useAuth();
  const { data: clientProfile } = useClient(currentUser?.uid);

  const profile = clientProfile || currentUserProfile;

  return {
    isAuthenticated: !!currentUser,
    isAdmin: profile?.role === 'admin',
    isClient: profile?.role === 'client',
    clientProfile: profile,
    canViewAllCommandes: profile?.role === 'admin',
    canModifyCommandes: profile?.role === 'admin',
    canViewAdminPanel: profile?.role === 'admin'
  };
};
