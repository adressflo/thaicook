import { useAuth } from '@/contexts/AuthContext';
import { useClient } from '@/hooks/useSupabaseData';
import { ReactNode } from 'react';

interface PermissionGuardProps {
  children: ReactNode;
  requireAdmin?: boolean;
  requireAuth?: boolean;
  fallback?: ReactNode;
}

export const PermissionGuard = ({ 
  children, 
  requireAdmin = false, 
  requireAuth = true,
  fallback = null 
}: PermissionGuardProps) => {
  const { currentUser, currentUserProfile } = useAuth();
  const { data: clientProfile, isLoading } = useClient(currentUser?.uid);

  // Attendre le chargement
  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-thai-orange"></div>
    </div>;
  }

  // Vérifier l'authentification
  if (requireAuth && !currentUser) {
    return fallback || <div>Authentification requise</div>;
  }

  // Utiliser le profil le plus à jour (hook ou contexte)
  const profile = clientProfile || currentUserProfile;

  // Vérifier les permissions admin
  if (requireAdmin && profile?.role !== 'admin') {
    // MODE DEBUG: Permettre l'accès temporairement pour les tests
    console.warn('⚠️ ACCÈS ADMIN TEMPORAIRE ACTIVÉ - À DÉSACTIVER EN PRODUCTION!');
    console.log('Profil utilisateur:', profile);
    
    // Décommentez pour activer temporairement l'accès admin :
    // return <>{children}</>;
    
    return fallback || (
      <div className="min-h-screen bg-gradient-thai flex items-center justify-center">
        <div className="text-center p-8 max-w-md mx-auto">
          <h2 className="text-2xl font-bold text-thai-green mb-2">Accès Refusé</h2>
          <p className="text-thai-green/70 mb-4">Vous devez être administrateur pour accéder à cette page.</p>
          <div className="text-sm text-gray-600 bg-white/50 p-4 rounded-lg">
            <p><strong>Profil actuel:</strong> {profile?.role || 'non défini'}</p>
            <p><strong>Email:</strong> {profile?.email}</p>
            <p className="mt-2 text-xs">Pour devenir admin, modifiez le champ 'role' dans la table client_db de Supabase</p>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

// Hook pour vérifier les permissions
// eslint-disable-next-line react-refresh/only-export-components
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

export default PermissionGuard;