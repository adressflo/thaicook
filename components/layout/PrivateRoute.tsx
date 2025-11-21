'use client';

import { useRouter } from 'next/navigation';
import { useSession } from '@/lib/auth-client';
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
    const { data: session, isPending: isLoadingAuth } = useSession();
    const currentUser = session?.user;
    const router = useRouter();

    useEffect(() => {
        // Si l'utilisateur n'est pas connecté, il est redirigé vers la page de login
        if (!isLoadingAuth && !currentUser) {
            router.push('/auth/login' as any);
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
