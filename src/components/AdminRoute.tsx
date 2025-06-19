import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext'; // CORRECTION : Le chemin pointe maintenant vers le bon fichier
import { Loader2 } from 'lucide-react';

const PageLoader = () => (
    <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-thai-orange" />
    </div>
);

const AdminRoute = () => {
    const { currentUserRole, isLoadingAuth, isLoadingUserRole } = useAuth();

    // Affiche un indicateur de chargement pendant que les informations de l'utilisateur sont récupérées
    if (isLoadingAuth || isLoadingUserRole) {
        return <PageLoader />;
    }

    // Si l'utilisateur n'est pas un admin, il est redirigé vers la page d'accueil
    if (currentUserRole !== 'admin') {
        return <Navigate to="/" replace />;
    }

    // Si l'utilisateur est un admin, affiche la page demandée
    return <Outlet />;
};

export default AdminRoute;
