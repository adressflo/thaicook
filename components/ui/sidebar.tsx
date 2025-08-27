'use client';

// src/components/Sidebar.tsx
import { useState, useEffect } from 'react';
import Link from 'next/link'; import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  Utensils, 
  Calendar, 
  MapPin, 
  User, 
  Users, 
  Menu,
  X,
  Shield
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import LanguageSelector from '../LanguageSelector';
import { useIsMobile } from '@/hooks/use-mobile';

const Sidebar = () => {
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(!isMobile); 
  const pathname = usePathname();
  const { t } = useTranslation();

  // Chemin vers TON logo
  const logoPath = "/lovable-uploads/62d46b15-aa56-45d2-ab7d-75dfee70f70d.png"; 

  const handleLinkClick = () => {
    if (isMobile) {
      setIsOpen(false);
    }
  };
  
  useEffect(() => {
    if(isMobile === undefined) return; 
    setIsOpen(!isMobile);
  }, [isMobile]);

  const navigation = [
    { name: t('navigation.dashboard'), href: '/', icon: LayoutDashboard },
    { name: t('navigation.order'), href: '/commander', icon: Utensils },
    { name: t('navigation.events'), href: '/evenements', icon: Calendar },
    { name: t('navigation.findUs'), href: '/nous-trouver', icon: MapPin },
    { name: t('navigation.profile'), href: '/profil', icon: User },
    { name: t('navigation.about'), href: '/a-propos', icon: Users },
  ];

  const isActive = (path: string) => pathname === path;

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
        "fixed left-0 top-0 z-50 h-full bg-white border-r border-thai-orange/20 shadow-lg transition-transform duration-300 ease-in-out",
        isMobile ? (isOpen ? "translate-x-0 w-64" : "-translate-x-full w-64") : 
        (isOpen ? "w-64" : "w-20") 
      )}>
        {!isMobile && (
          <div className="p-3 border-b border-thai-orange/20 flex items-center"
              style={{ minHeight: '65px' }} 
          >
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              className="hover:bg-thai-orange/10 text-thai-orange"
              aria-label={isOpen ? "Réduire le menu" : "Agrandir le menu"}
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            {isOpen && (
              <span className="ml-2 text-sm font-medium text-thai-green whitespace-nowrap">
                {t('common.close')}
              </span>
            )}
          </div>
        )}

        <div className={cn(
                "p-3 border-b border-thai-orange/20 flex items-center",
                isMobile && isOpen ? "mt-12" : "" // Marge en haut sur mobile si sidebar et burger ouverts
             )}
             style={{ minHeight: '65px' }}
        >
          <Link href="/" className="flex items-center space-x-2 overflow-hidden" onClick={handleLinkClick}>
            <img 
              src={logoPath} 
              alt="Logo ChanthanaThaiCook" 
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

        {isOpen && (
          <div className="p-3 border-b border-thai-orange/20">
            <LanguageSelector />
          </div>
        )}

        <nav className="flex-grow p-3 space-y-1 overflow-y-auto">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
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

          <div className="pt-4 mt-4 border-t border-thai-orange/10">
            <Link
              href="/admin"
              onClick={handleLinkClick}
              className={cn(
                "flex items-center px-3 py-2.5 rounded-lg transition-colors duration-200 group",
                isActive('/admin') || pathname?.startsWith('/admin')
                  ? "bg-thai-green text-white shadow-md"
                  : "text-thai-green/80 hover:bg-thai-green/10 hover:text-thai-green",
                !isOpen && "justify-center"
              )}
              title={isOpen ? "" : t('navigation.administration')}
            >
              <Shield className={cn("h-5 w-5 flex-shrink-0", isActive('/admin') || pathname?.startsWith('/admin') ? "text-white" : "text-thai-green/80 group-hover:text-thai-green")} />
              {isOpen && <span className="ml-3 text-sm font-medium">{t('navigation.administration')}</span>}
            </Link>
          </div>
        </nav>
      </div>
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;
