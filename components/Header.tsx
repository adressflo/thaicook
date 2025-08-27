'use client';


import { useState } from 'react';
import Link from 'next/link'; import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Menu, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const navigation = [
    { name: 'Accueil', href: '/' },
    { name: 'Commander', href: '/commander' },
    { name: 'Événements', href: '/evenements' },
    { name: 'Mon Profil', href: '/profil' },
  ];

  const isActive = (path: string) => pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-thai-orange/20">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-thai-orange to-thai-gold rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">C</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-thai-green">ChanthanaThaiCook</span>
              <span className="text-xs text-thai-orange -mt-1">Cuisine Thaïlandaise Authentique</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "px-4 py-2 rounded-lg transition-all duration-200 font-medium",
                  isActive(item.href)
                    ? "bg-thai-orange text-white shadow-lg"
                    : "text-thai-green hover:bg-thai-orange/10 hover:text-thai-orange"
                )}
              >
                {item.name}
              </Link>
            ))}
            <Link
              href="/admin"
              className={cn(
                "px-3 py-2 rounded-lg transition-all duration-200 text-sm",
                isActive('/admin')
                  ? "bg-thai-green text-white"
                  : "text-thai-green/70 hover:bg-thai-green/10 hover:text-thai-green"
              )}
              title="Administration"
            >
              <Settings className="h-4 w-4" />
            </Link>
          </nav>

          {/* Mobile menu button */}
          <Button
            variant="outline"
            size="sm"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu className="h-4 w-4" />
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-thai-orange/20 animate-slide-in">
            <nav className="flex flex-col space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "px-4 py-3 rounded-lg transition-all duration-200 font-medium",
                    isActive(item.href)
                      ? "bg-thai-orange text-white"
                      : "text-thai-green hover:bg-thai-orange/10"
                  )}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <Link
                href="/admin"
                className={cn(
                  "px-4 py-3 rounded-lg transition-all duration-200 text-sm flex items-center space-x-2",
                  isActive('/admin')
                    ? "bg-thai-green text-white"
                    : "text-thai-green/70 hover:bg-thai-green/10"
                )}
                onClick={() => setIsMenuOpen(false)}
              >
                <Settings className="h-4 w-4" />
                <span>Administration</span>
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
