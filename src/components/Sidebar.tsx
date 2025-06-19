import { useEffect, Dispatch, SetStateAction } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Calendar, 
  MapPin, 
  User, 
  Users, 
  Menu,
  X,
  Shield,
  History,
  Utensils
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/contexts/AuthContext';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

export const Sidebar = ({ isOpen, setIsOpen }: SidebarProps) => {
  const isMobile = useIsMobile();
  const location = useLocation();
  const { currentUserRole, currentUser } = useAuth();

  const logoPath = "/images/logo.png"; 

  const handleLinkClick = () => {
    if (isMobile) {
      setIsOpen(false);
    }
  };
  
  useEffect(() => {
    if(isMobile === undefined) return;
    setIsOpen(!isMobile);
  }, [isMobile, setIsOpen]);

  const navigation = [
    { name: "Commander", href: '/commander', icon: ShoppingCart },
    currentUser && { name: "Suivi & historique", href: '/historique', icon: History },
    { name: "Événements", href: '/evenements', icon: Calendar },
    { name: "Nous trouver", href: '/nous-trouver', icon: MapPin },
    { name: "Profil", href: '/profil', icon: User },
    { name: "À propos", href: '/a-propos', icon: Users },
  ].filter(Boolean);

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {isMobile && (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsOpen(!isOpen)}
          className="fixed top-4 left-4 z-[60] bg-white/80 backdrop-blur-sm text-thai-orange hover:bg-thai-orange/10 md:hidden"
          aria-label={isOpen ? "Fermer le menu" : "Ouvrir le menu"}
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      )}

      <div className={cn(
        "fixed left-0 top-0 z-40 h-full bg-white border-r border-thai-orange/20 shadow-lg transition-all duration-300",
        isMobile ? (isOpen ? "translate-x-0 w-64" : "-translate-x-full w-64") : 
        (isOpen ? "w-64" : "w-20") 
      )}>
        <div className="p-3 border-b border-thai-orange/20 flex items-center justify-between"
              style={{ minHeight: '65px' }} 
          >
          {!isMobile && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              className="hover:bg-thai-orange/10 text-thai-orange"
              aria-label={isOpen ? "Réduire le menu" : "Agrandir le menu"}
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          )}
        </div>

        <div className={cn(
                "p-3 border-b border-thai-orange/20 flex items-center",
                isMobile && isOpen ? "mt-12" : ""
             )}
             style={{ minHeight: '65px' }}
        >
          <Link to="/" className="flex items-center space-x-2 overflow-hidden" onClick={handleLinkClick}>
            <img 
              src={logoPath} 
              alt="ChanthanaThaiCook Logo" 
              className="w-10 h-10 rounded-full object-contain flex-shrink-0"
            />
            {isOpen && (
              <div className="flex flex-col truncate">
                <span className="text-base font-bold text-thai-green whitespace-nowrap">ChanthanaThaiCook</span>
                <span className="text-xs text-thai-orange -mt-1 whitespace-nowrap">Cuisine Thaïlandaise</span>
              </div>
            )}
          </Link>
        </div>

        <nav className="flex-grow p-3 space-y-1 overflow-y-auto">
          {navigation.map((item) => item && (
            <Link
              key={item.name}
              to={item.href}
              onClick={handleLinkClick}
              className={cn(
                "flex items-center px-3 py-2.5 rounded-lg transition-colors duration-200 group",
                isActive(item.href)
                  ? "bg-thai-orange text-white shadow-md"
                  : "text-thai-green hover:bg-thai-orange/10 hover:text-thai-orange",
                !isOpen && "justify-center" 
              )}
              title={isOpen ? "" : item.name}
            >
              <item.icon className={cn("h-5 w-5 flex-shrink-0", isActive(item.href) ? "text-white" : "text-thai-orange group-hover:text-thai-orange")} />
              {isOpen && <span className="ml-3 text-sm font-medium">{item.name}</span>}
            </Link>
          ))}

          {currentUserRole === 'admin' && (
            <div className="pt-4 mt-4 border-t border-thai-orange/10">
              <Link
                to="/admin"
                onClick={handleLinkClick}
                className={cn(
                  "flex items-center px-3 py-2.5 rounded-lg transition-colors duration-200 group",
                  isActive('/admin') || location.pathname.startsWith('/admin')
                    ? "bg-thai-green text-white shadow-md"
                    : "text-thai-green/80 hover:bg-thai-green/10 hover:text-thai-green",
                  !isOpen && "justify-center"
                )}
                title={"Administration"}
              >
                <Shield className={cn("h-5 w-5 flex-shrink-0", isActive('/admin') || location.pathname.startsWith('/admin') ? "text-white" : "text-thai-green/80 group-hover:text-thai-green")} />
                {isOpen && <span className="ml-3 text-sm font-medium">Administration</span>}
              </Link>
            </div>
          )}
        </nav>
      </div>
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};
