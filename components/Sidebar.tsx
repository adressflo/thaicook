'use client';

import { useEffect, Dispatch, SetStateAction } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  ShoppingCart,
  Calendar,
  MapPin,
  User,
  Users,
  Menu,
  ChevronLeft,
  ChevronRight,
  Shield,
  History,
  Command,
  ShoppingBasket,
  CookingPot,
  Settings,
  TrendingUp,
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
  const pathname = usePathname();
  const { currentUserRole, currentUser } = useAuth();

  const logoPath = '/logo.svg';

  const handleLinkClick = () => {
    if (isMobile) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (isMobile === undefined) return;
    setIsOpen(!isMobile);
  }, [isMobile, setIsOpen]);

  const navigation = [
    { name: 'Commander', href: '/commander', icon: ShoppingCart },
    currentUser && {
      name: 'Suivi & historique',
      href: '/historique',
      icon: History,
    },
    { name: 'Événements', href: '/evenements', icon: Calendar },
    { name: 'Nous trouver', href: '/nous-trouver', icon: MapPin },
    { name: 'Profil', href: '/profil', icon: User },
    { name: 'À propos', href: '/a-propos', icon: Users },
  ].filter(Boolean);

  const adminMenuItems = [
    {
      name: 'Centre de Commandement',
      href: '/admin/centre-commandement',
      icon: Command,
    },
    { name: 'Approvisionnement', href: '/admin/courses', icon: ShoppingCart },
    { name: 'Commandes', href: '/admin/commandes', icon: ShoppingBasket },
    { name: 'Gestion Plats', href: '/admin/plats', icon: CookingPot },
    { name: 'Clients', href: '/admin/clients', icon: Users },
    { name: 'Statistiques', href: '/admin/statistiques', icon: TrendingUp },
    { name: 'Paramètres', href: '/admin/parametres', icon: Settings },
  ];

  const isActive = (path: string) => pathname === path;
  const isAdminActive = () => pathname?.startsWith('/admin') ?? false;

  return (
    <>
      {/* Bouton hamburger pour mobile uniquement */}
      {isMobile && (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsOpen(!isOpen)}
          className="fixed top-4 left-4 z-[60] bg-white/90 backdrop-blur-sm text-thai-orange hover:bg-thai-orange/10 md:hidden shadow-md"
          aria-label={isOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
        >
          <Menu className="h-6 w-6" />
        </Button>
      )}

      <div
        className={cn(
          'fixed left-0 top-0 z-40 h-full bg-white border-r border-thai-orange/20 shadow-lg transition-all duration-300 group',
          isMobile
            ? isOpen
              ? 'translate-x-0 w-64'
              : '-translate-x-full w-64'
            : isOpen
            ? 'w-64'
            : 'w-20'
        )}
      >
        {/* Header avec logo */}
        <div
          className={cn(
            'p-3 border-b border-thai-orange/20 flex items-center relative',
            isMobile && isOpen ? 'mt-12' : ''
          )}
          style={{ minHeight: '65px' }}
        >
          <Link
            href="/"
            className="flex items-center space-x-2 overflow-hidden w-full"
            onClick={handleLinkClick}
          >
            <img
              src={logoPath}
              alt="ChanthanaThaiCook Logo"
              className="w-10 h-10 rounded-full object-contain flex-shrink-0"
            />
            {isOpen && (
              <div className="flex flex-col truncate">
                <span className="text-base font-bold text-thai-green whitespace-nowrap">
                  ChanthanaThaiCook
                </span>
                <span className="text-xs text-thai-orange -mt-1 whitespace-nowrap">
                  Cuisine Thaïlandaise
                </span>
              </div>
            )}
          </Link>

          {/* Bouton toggle pour desktop - visible au hover ou quand la sidebar est fermée */}
          {!isMobile && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              className={cn(
                'absolute -right-3 top-1/2 -translate-y-1/2 h-6 w-6 rounded-full bg-white border-2 border-thai-orange/20 text-thai-orange hover:bg-thai-orange hover:text-white shadow-md transition-all duration-200',
                isOpen ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'
              )}
              aria-label={isOpen ? 'Réduire le menu' : 'Agrandir le menu'}
            >
              {isOpen ? (
                <ChevronLeft className="h-3 w-3" />
              ) : (
                <ChevronRight className="h-3 w-3" />
              )}
            </Button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-grow p-3 space-y-1 overflow-y-auto">
          {navigation.map(
            item =>
              item && (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={handleLinkClick}
                  className={cn(
                    'flex items-center px-3 py-2.5 rounded-lg transition-colors duration-200 group relative',
                    isActive(item.href)
                      ? 'bg-thai-orange text-white shadow-md'
                      : 'text-thai-green hover:bg-thai-orange/10 hover:text-thai-orange',
                    !isOpen && 'justify-center'
                  )}
                >
                  <item.icon
                    className={cn(
                      'h-5 w-5 flex-shrink-0',
                      isActive(item.href)
                        ? 'text-white'
                        : 'text-thai-orange group-hover:text-thai-orange'
                    )}
                  />
                  {isOpen && (
                    <span className="ml-3 text-sm font-medium">
                      {item.name}
                    </span>
                  )}

                  {/* Tooltip pour le mode réduit */}
                  {!isOpen && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50">
                      {item.name}
                    </div>
                  )}
                </Link>
              )
          )}

          {/* Section Admin */}
          {currentUserRole === 'admin' && (
            <div className="pt-4 mt-4 border-t border-thai-orange/10">
              {/* En-tête Administration */}
              <Link
                href="/admin"
                onClick={handleLinkClick}
                className={cn(
                  'flex items-center px-3 py-2.5 rounded-lg transition-colors duration-200 group relative mb-2',
                  isAdminActive()
                    ? 'bg-thai-green text-white shadow-md'
                    : 'text-thai-green/80 hover:bg-thai-green/10 hover:text-thai-green',
                  !isOpen && 'justify-center'
                )}
              >
                <Shield
                  className={cn(
                    'h-5 w-5 flex-shrink-0',
                    isAdminActive()
                      ? 'text-white'
                      : 'text-thai-green/80 group-hover:text-thai-green'
                  )}
                />
                {isOpen && (
                  <span className="ml-3 text-sm font-medium">
                    Administration
                  </span>
                )}

                {/* Tooltip pour le mode réduit */}
                {!isOpen && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50">
                    Administration
                  </div>
                )}
              </Link>

              {/* Sous-menus admin - visibles uniquement quand sidebar ouverte et sur pages admin */}
              {isOpen && isAdminActive() && (
                <div className="ml-4 space-y-1">
                  {adminMenuItems.map(item => (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={handleLinkClick}
                      className={cn(
                        'flex items-center px-3 py-2 rounded-lg transition-colors duration-200 group relative text-sm',
                        isActive(item.href)
                          ? 'bg-thai-orange text-white shadow-sm'
                          : 'text-thai-green/70 hover:bg-thai-orange/10 hover:text-thai-orange'
                      )}
                    >
                      <item.icon
                        className={cn(
                          'h-4 w-4 flex-shrink-0 mr-3',
                          isActive(item.href)
                            ? 'text-white'
                            : 'text-thai-orange/70 group-hover:text-thai-orange'
                        )}
                      />
                      <span className="truncate">{item.name}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
        </nav>

        {/* Zone de toggle invisible pour desktop - élargie pour faciliter l'interaction */}
        {!isMobile && !isOpen && (
          <div
            className="absolute -right-4 top-0 w-8 h-full cursor-pointer opacity-0 hover:opacity-10 bg-thai-orange transition-opacity duration-200"
            onClick={() => setIsOpen(true)}
            title="Ouvrir le menu"
          />
        )}
      </div>

      {/* Overlay pour mobile */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};
