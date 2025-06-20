import { ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { usePermissions } from '@/components/PermissionGuard';
import { 
  ArrowLeft,
  Bell
} from 'lucide-react';

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { clientProfile } = usePermissions();

  const getCurrentPageTitle = () => {
    const path = location.pathname;
    if (path.includes('centre-commandement') || path === '/admin') return 'Centre de Commandement';
    if (path.includes('courses')) return 'Centrale d\'Approvisionnement';
    if (path.includes('commandes')) return 'Commandes';
    if (path.includes('plats')) return 'Gestion Plats';
    if (path.includes('clients')) return 'Clients';
    if (path.includes('statistiques')) return 'Statistiques';
    if (path.includes('parametres')) return 'Paramètres';
    return 'Administration';
  };

  return (
    <div className="min-h-screen">
      {/* Header Admin */}
      <div className="bg-white shadow-lg border-b-4 border-thai-orange">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo et titre */}
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/')}
                className="text-thai-green hover:bg-thai-green/10"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour au site
              </Button>
              <div className="h-8 w-px bg-gray-300" />
              <h1 className="text-2xl font-bold text-thai-green">
                {getCurrentPageTitle()}
              </h1>
            </div>

            {/* Infos admin */}
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="w-5 h-5" />
                <Badge 
                  variant="destructive" 
                  className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs"
                >
                  3
                </Badge>
              </Button>
              <div className="text-right">
                <p className="text-sm font-medium text-thai-green">
                  {clientProfile?.prenom} {clientProfile?.nom}
                </p>
                <Badge variant="default" className="bg-green-100 text-green-800 text-xs">
                  Administrateur
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </div>
    </div>
  );
};

export default AdminLayout;