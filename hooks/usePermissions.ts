'use client'

import { useSession } from '@/lib/auth-client';
import { useState, useEffect } from 'react';
import { getClientProfile } from '@/app/profil/actions';

// Hook pour vérifier les permissions
export const usePermissions = () => {
  // Better Auth session
  const { data: session, isPending: isLoadingAuth } = useSession();
  const currentUser = session?.user;

  // Client profile
  const [clientProfile, setClientProfile] = useState<any>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);

  useEffect(() => {
    if (currentUser) {
      setIsLoadingProfile(true);
      getClientProfile()
        .then(setClientProfile)
        .finally(() => setIsLoadingProfile(false));
    } else {
      setClientProfile(null);
      setIsLoadingProfile(false);
    }
  }, [currentUser?.id]);

  const isLoading = isLoadingAuth || isLoadingProfile;

  return {
    isAuthenticated: !!currentUser,
    isAdmin: clientProfile?.role === 'admin',
    isClient: clientProfile?.role === 'client',
    clientProfile: clientProfile,
    canViewAllCommandes: clientProfile?.role === 'admin',
    canModifyCommandes: clientProfile?.role === 'admin',
    canViewAdminPanel: clientProfile?.role === 'admin',
    isLoading,
  };
};
