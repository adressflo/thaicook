'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

// Composant de chargement réutilisable
const PageLoader = () => (
  <div className="flex h-screen items-center justify-center bg-background">
    <div className="flex flex-col items-center gap-4">
      <Loader2 className="h-12 w-12 animate-spin text-thai-orange" />
      <p className="text-sm text-muted-foreground">Vérification des permissions...</p>
    </div>
  </div>
);

// Composant d'erreur d'accès
const AccessDenied = () => (
  <div className="flex h-screen items-center justify-center bg-background p-4">
    <div className="max-w-md w-full">
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription className="mt-2">
          <strong>Accès refusé</strong>
          <br />
          Vous n'avez pas les permissions nécessaires pour accéder à cette page.
          Seuls les administrateurs peuvent accéder à cette section.
        </AlertDescription>
      </Alert>
    </div>
  </div>
);

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const router = useRouter();
  const { 
    currentUser, 
    currentUserRole, 
    isLoadingAuth, 
    isLoadingUserRole 
  } = useAuth();

  useEffect(() => {
    // Si l'utilisateur n'est pas connecté, redirection vers la page de connexion
    if (!isLoadingAuth && !currentUser) {
      router.push('/profil');
      return;
    }

    // Si l'utilisateur n'est pas un admin, redirection vers l'accueil
    if (!isLoadingUserRole && currentUserRole && currentUserRole !== 'admin') {
      router.push('/');
      return;
    }
  }, [currentUser, currentUserRole, isLoadingAuth, isLoadingUserRole, router]);

  // Affiche un indicateur de chargement pendant la vérification de l'authentification
  if (isLoadingAuth || isLoadingUserRole) {
    return <PageLoader />;
  }

  // Si l'utilisateur n'est pas connecté
  if (!currentUser) {
    return <PageLoader />;
  }

  // Si les données utilisateur ne sont pas encore chargées
  if (!currentUserRole) {
    return <PageLoader />;
  }

  // Si l'utilisateur n'est pas un admin, affichage d'un message d'erreur
  if (currentUserRole !== 'admin') {
    return <AccessDenied />;
  }

  // Si l'utilisateur est un admin, affiche le contenu
  return <>{children}</>;
};

export default AdminRoute;
