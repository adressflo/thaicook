import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

const PageLoader = () => (
    <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-thai-orange" />
    </div>
);

const PrivateRoute = () => {
    const { currentUser, isLoadingAuth } = useAuth();

    // Affiche un indicateur de chargement pendant que les informations de l'utilisateur sont récupérées
    if (isLoadingAuth) {
        return <PageLoader />;
    }

    // Si l'utilisateur n'est pas connecté, il est redirigé vers la page profil pour se connecter
    if (!currentUser) {
        return <Navigate to="/profil" replace />;
    }

    // Si l'utilisateur est connecté, affiche la page demandée
    return <Outlet />;
};

export default PrivateRoute;
