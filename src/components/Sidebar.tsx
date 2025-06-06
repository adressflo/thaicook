// src/components/Sidebar.tsx
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Utensils,
  Calendar,
  MapPin,
  User,
  Users,
  Menu,
  X,
  Shield
} from 'lucide-react'; // LayoutDashboard a été enlevé lors d'une modif précédente
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import LanguageSelector from './LanguageSelector';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true); // La sidebar est ouverte par défaut
  const location = useLocation();
  const { t } = useTranslation();

  const logoPath = "/lovable-uploads/62d46b15-aa56-45d2-ab7d-75dfee70f70d.png";

  const navigation = [
    { name: t('navigation.order'), href: '/commander', icon: Utensils },
    { name: t('navigation.events'), href: '/evenements', icon: Calendar },
    { name: t('navigation.findUs'), href: '/nous-trouver', icon: MapPin },
    { name: t('navigation.profile'), href: '/profil', icon: User },
    { name: t('navigation.about'), href: '/a-propos', icon: Users },
  ];

  const isActive = (path: string) => location.pathname === path;

  // Gère la bascule pour mobile également si isOpen est changé par le bouton X/Menu
  // Cette partie est simplifiée par rapport à une version précédente qui utilisait useIsMobile.
  // Si vous avez besoin d'un comportement distinct pour le burger menu mobile vs le toggle desktop,
  // il faudra réintégrer la logique useIsMobile.
  const toggleSidebar = () => setIsOpen(!isOpen);


  return (
    <>
      {/* Bouton Burger pour mobile (exemple, pourrait être affiné avec useIsMobile) */}
      {/* Vous aviez un bouton similaire dans une version précédente, à réintégrer/adapter si besoin */}
      {/* <Button
        variant="ghost"
        size="icon"
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-[60] bg-white/80 backdrop-blur-sm text-thai-orange hover:bg-thai-orange/10 md:hidden"
        aria-label={isOpen ? "Fermer le menu" : "Ouvrir le menu"}
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button> */}

      <div className={cn(
        "fixed left-0 top-0 z-50 h-full bg-white border-r border-thai-orange/20 shadow-lg transition-all duration-300", // Ajout de shadow-lg pour la visibilité
        isOpen ? "w-64" : "w-20" // Largeur ajustée pour l'état réduit
      )}>
        {/* Section supérieure: Bouton Toggle et Sélecteur de langue */}
        <div
          className="p-3 border-b border-thai-orange/20 flex items-center justify-between" // Utilisation de justify-between
          style={{ minHeight: '65px' }}
        >
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="hover:bg-thai-orange/10 text-thai-orange"
            aria-label={isOpen ? "Réduire le menu" : "Agrandir le menu"}
          >
            {/* L'icône change en fonction de l'état isOpen */}
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
          {/* Le texte "Fermer" a été supprimé d'ici */}

          {/* Sélecteur de langue, visible seulement si la sidebar est ouverte */}
          {isOpen && (
            <div className="pr-1"> {/* Ajout d'un léger padding à droite si besoin */}
              <LanguageSelector />
            </div>
          )}
        </div>

        {/* Logo */}
        <div className="p-3 border-b border-thai-orange/20 flex items-center" style={{ minHeight: '65px' }}>
          <Link to="/" className="flex items-center space-x-2 overflow-hidden" onClick={() => { if (isOpen /*&& isMobile (si réintégré)*/) setIsOpen(false);}}>
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

        {/* L'ancien emplacement du LanguageSelector (sous le logo) est maintenant supprimé */}

        {/* Navigation */}
        <nav className="flex-grow p-3 space-y-1 overflow-y-auto">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              onClick={() => { if (isOpen /*&& isMobile*/) setIsOpen(false);}} // Ferme la sidebar sur mobile lors d'un clic
              className={cn(
                "flex items-center px-3 py-2.5 rounded-lg transition-colors duration-200 group",
                isActive(item.href)
                  ? "bg-thai-orange text-white shadow-md"
                  : "text-thai-green hover:bg-thai-orange/10 hover:text-thai-orange",
                !isOpen && "justify-center"
              )}
              title={isOpen ? "" : item.name} // Le titre s'affiche quand la sidebar est réduite
            >
              <item.icon className={cn("h-5 w-5 flex-shrink-0", isActive(item.href) ? "text-white" : "text-thai-orange group-hover:text-thai-orange")} />
              {isOpen && <span className="ml-3 text-sm font-medium">{item.name}</span>}
            </Link>
          ))}

          {/* Admin Section */}
          <div className="pt-4 mt-4 border-t border-thai-orange/10">
            <Link
              to="/admin"
              onClick={() => { if (isOpen /*&& isMobile*/) setIsOpen(false);}}
              className={cn(
                "flex items-center px-3 py-2.5 rounded-lg transition-colors duration-200 group",
                isActive('/admin') || location.pathname.startsWith('/admin')
                  ? "bg-thai-green text-white shadow-md"
                  : "text-thai-green/80 hover:bg-thai-green/10 hover:text-thai-green",
                !isOpen && "justify-center"
              )}
              title={isOpen ? "" : t('navigation.administration')}
            >
              <Shield className={cn("h-5 w-5 flex-shrink-0", isActive('/admin') || location.pathname.startsWith('/admin') ? "text-white" : "text-thai-green/80 group-hover:text-thai-green")} />
              {isOpen && <span className="ml-3 text-sm font-medium">{t('navigation.administration')}</span>}
            </Link>
          </div>
        </nav>
      </div>

      {/* Overlay pour mobile - à réactiver et affiner avec useIsMobile si besoin */}
      {/* {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )} */}
    </>
  );
};

export default Sidebar;