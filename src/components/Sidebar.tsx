
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
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
import LanguageSelector from './LanguageSelector';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation();
  const { t } = useTranslation();

  const navigation = [
    { name: t('navigation.dashboard'), href: '/', icon: LayoutDashboard },
    { name: t('navigation.order'), href: '/commander', icon: Utensils },
    { name: t('navigation.events'), href: '/evenements', icon: Calendar },
    { name: t('navigation.findUs'), href: '/nous-trouver', icon: MapPin },
    { name: t('navigation.profile'), href: '/profil', icon: User },
    { name: t('navigation.about'), href: '/a-propos', icon: Users },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <div className={cn(
        "fixed left-0 top-0 z-50 h-full bg-white border-r border-thai-orange/20 transition-all duration-300",
        isOpen ? "w-64" : "w-16"
      )}>
        {/* Toggle Button */}
        <div className="p-4 border-b border-thai-orange/20">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(!isOpen)}
            className="w-full justify-start"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            {isOpen && <span className="ml-2">{t('common.close')}</span>}
          </Button>
        </div>

        {/* Logo */}
        <div className="p-4 border-b border-thai-orange/20">
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-thai-orange to-thai-gold rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-lg">C</span>
            </div>
            {isOpen && (
              <div className="flex flex-col">
                <span className="text-lg font-bold text-thai-green">ChanthanaThaiCook</span>
                <span className="text-xs text-thai-orange -mt-1">Cuisine Thaïlandaise</span>
              </div>
            )}
          </Link>
        </div>

        {/* Language Selector */}
        {isOpen && (
          <div className="p-4 border-b border-thai-orange/20">
            <LanguageSelector />
          </div>
        )}

        {/* Navigation */}
        <nav className="p-4">
          <div className="space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "flex items-center px-3 py-2 rounded-lg transition-all duration-200 font-medium",
                  isActive(item.href)
                    ? "bg-thai-orange text-white shadow-lg"
                    : "text-thai-green hover:bg-thai-orange/10 hover:text-thai-orange"
                )}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                {isOpen && <span className="ml-3">{item.name}</span>}
              </Link>
            ))}
          </div>

          {/* Admin Section */}
          <div className="mt-8 pt-4 border-t border-thai-orange/20">
            <Link
              to="/admin"
              className={cn(
                "flex items-center px-3 py-2 rounded-lg transition-all duration-200 font-medium",
                isActive('/admin') || location.pathname.startsWith('/admin')
                  ? "bg-thai-green text-white"
                  : "text-thai-green/70 hover:bg-thai-green/10 hover:text-thai-green"
              )}
              title={t('navigation.administration')}
            >
              <Shield className="h-5 w-5 flex-shrink-0" />
              {isOpen && <span className="ml-3">{t('navigation.administration')}</span>}
            </Link>
          </div>
        </nav>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-40 lg:hidden" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;
