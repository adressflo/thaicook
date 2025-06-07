import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth'; // CORRECTION : Import depuis le bon fichier de hook
import { Loader2 } from 'lucide-react';

const AdminRoute: React.FC = () => {
  const { currentUser, currentUserRole, isLoadingAuth, isLoadingUserRole } = useAuth();
  const location = useLocation();

  const isLoading = isLoadingAuth || isLoadingUserRole;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-thai">
        <div className="text-center">
          <Loader2 className="w-16 h-16 border-4 border-thai-orange border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-thai-green font-medium">Vérification de l'accès...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    // Redirige vers la page de profil pour se connecter, en gardant en mémoire la page de départ
    return <Navigate to="/profil" state={{ from: location }} replace />;
  }

  if (currentUserRole !== 'admin') {
    // Si l'utilisateur n'est pas admin, redirige vers la page d'accueil
    return <Navigate to="/" replace />;
  }

  // Si tout est bon, affiche le contenu de la route admin
  return <Outlet />;
};

export default AdminRoute;