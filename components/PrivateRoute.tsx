'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';
import { useEffect } from 'react';

const PageLoader = () => (
    <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-thai-orange" />
    </div>
);

interface PrivateRouteProps {
    children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
    const { currentUser, isLoadingAuth } = useAuth();
    const router = useRouter();

    useEffect(() => {
        // Si l'utilisateur n'est pas connecté, il est redirigé vers la page profil pour se connecter
        if (!isLoadingAuth && !currentUser) {
            router.push('/profil');
        }
    }, [currentUser, isLoadingAuth, router]);

    // Affiche un indicateur de chargement pendant que les informations de l'utilisateur sont récupérées
    if (isLoadingAuth) {
        return <PageLoader />;
    }

    // Si l'utilisateur n'est pas connecté
    if (!currentUser) {
        return <PageLoader />;
    }

    // Si l'utilisateur est connecté, affiche le contenu
    return <>{children}</>;
};

export default PrivateRoute;
