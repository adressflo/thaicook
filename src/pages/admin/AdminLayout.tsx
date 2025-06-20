import { ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { usePermissions } from '@/components/PermissionGuard';
import { 
  BarChart3, 
  ShoppingBasket, 
  Users, 
  CookingPot, 
  Settings, 
  TrendingUp,
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

  const menuItems = [
    {
      path: '/admin/dashboard',
      label: 'Tableau de Bord',
      icon: BarChart3,
      description: 'Vue d\'ensemble et statistiques'
    },
    {
      path: '/admin/commandes',
      label: 'Commandes',
      icon: ShoppingBasket,
      description: 'Gestion des commandes'
    },
    {
      path: '/admin/plats',
      label: 'Gestion Plats',
      icon: CookingPot,
      description: 'Créer et modifier les plats'
    },
    {
      path: '/admin/clients',
      label: 'Clients',
      icon: Users,
      description: 'Gestion des utilisateurs'
    },
    {
      path: '/admin/statistiques',
      label: 'Statistiques',
      icon: TrendingUp,
      description: 'Analyses détaillées'
    },
    {
      path: '/admin/parametres',
      label: 'Paramètres',
      icon: Settings,
      description: 'Configuration système'
    }
  ];

  const getCurrentPageTitle = () => {
    const currentItem = menuItems.find(item => item.path === location.pathname);
    return currentItem?.label || 'Administration';
  };

  return (
    <div className="min-h-screen bg-gradient-thai">
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
                Administration
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Navigation latérale */}
          <div className="w-80 flex-shrink-0">
            <Card className="p-6 sticky top-8">
              <h2 className="text-lg font-semibold text-thai-green mb-4">
                Navigation
              </h2>
              <nav className="space-y-2">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  
                  return (
                    <Button
                      key={item.path}
                      variant={isActive ? "default" : "ghost"}
                      className={`w-full justify-start h-auto p-4 ${
                        isActive 
                          ? 'bg-thai-orange hover:bg-thai-orange/90 text-white' 
                          : 'text-thai-green hover:bg-thai-green/10'
                      }`}
                      onClick={() => navigate(item.path)}
                    >
                      <div className="flex items-start gap-3 text-left">
                        <Icon className="w-5 h-5 mt-0.5 flex-shrink-0" />
                        <div>
                          <div className="font-medium">{item.label}</div>
                          <div className={`text-xs mt-1 ${
                            isActive ? 'text-white/80' : 'text-gray-500'
                          }`}>
                            {item.description}
                          </div>
                        </div>
                      </div>
                    </Button>
                  );
                })}
              </nav>
            </Card>
          </div>

          {/* Contenu principal */}
          <div className="flex-1 min-w-0">
            {/* Titre de la page */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-thai-green">
                {getCurrentPageTitle()}
              </h1>
              <p className="text-thai-green/70 mt-1">
                Gérez votre restaurant thaïlandais depuis ce panel d'administration
              </p>
            </div>

            {/* Contenu de la page */}
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
export default AdminLayout;