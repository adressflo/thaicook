'use client';

import { PermissionGuard } from '@/components/PermissionGuard';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { 
  LayoutGrid, 
  ShoppingCart, 
  Users, 
  BarChart3, 
  Settings, 
  Utensils, 
  Package, 
  Bot, 
  Zap, 
  Home,
  ChevronLeft
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const adminNavItems = [
  {
    title: "Centre de Commandement",
    href: "/admin",
    icon: LayoutGrid,
    description: "Vue d'ensemble et contrôle principal"
  },
  {
    title: "Commandes",
    href: "/admin/commandes",
    icon: ShoppingCart,
    description: "Gestion des commandes clients"
  },
  {
    title: "Plats & Menu",
    href: "/admin/plats",
    icon: Utensils,
    description: "Gestion du menu et des plats"
  },
  {
    title: "Clients",
    href: "/admin/clients",
    icon: Users,
    description: "Gestion de la clientèle"
  },
  {
    title: "Statistiques",
    href: "/admin/statistiques",
    icon: BarChart3,
    description: "Analyses et rapports"
  },
  {
    title: "Approvisionnement",
    href: "/admin/courses",
    icon: Package,
    description: "Gestion des stocks"
  },
  {
    title: "IA Recommandations",
    href: "/admin/recommendations-ia",
    icon: Bot,
    description: "Intelligence artificielle"
  },
  {
    title: "IA Stock",
    href: "/admin/stock-ia",
    icon: Zap,
    description: "Gestion intelligente du stock"
  },
  {
    title: "Advanced",
    href: "/admin/advanced",
    icon: Settings,
    description: "Paramètres avancés"
  },
  {
    title: "Paramètres",
    href: "/admin/parametres",
    icon: Settings,
    description: "Configuration système"
  }
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PermissionGuard requireAdmin={true}>
      <div className="min-h-screen bg-gradient-to-br from-thai-cream/30 to-thai-gold/10">
        {/* Header Admin */}
        <header className="bg-gradient-to-r from-thai-green to-thai-orange text-white shadow-xl border-b border-thai-orange/20">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button asChild variant="ghost" size="sm" className="text-white hover:bg-white/20">
                  <Link href="/" className="flex items-center gap-2">
                    <ChevronLeft className="h-4 w-4" />
                    <Home className="h-4 w-4" />
                    Retour au site
                  </Link>
                </Button>
                <div>
                  <h1 className="text-2xl font-bold">Administration ChanthanaThaiCook</h1>
                  <p className="text-white/90 text-sm">Panneau de contrôle administrateur</p>
                </div>
              </div>
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                Admin Mode
              </Badge>
            </div>
          </div>
        </header>

        {/* Navigation Admin */}
        <nav className="bg-white/80 backdrop-blur-sm border-b border-thai-orange/10 sticky top-0 z-10">
          <div className="container mx-auto px-4 py-3">
            <div className="flex flex-wrap gap-2">
              {adminNavItems.map((item) => (
                <Button
                  key={item.href}
                  asChild
                  variant="ghost"
                  size="sm"
                  className="text-thai-green hover:bg-thai-orange/10 hover:text-thai-orange transition-all duration-200"
                >
                  <Link href={item.href as any} className="flex items-center gap-2">
                    <item.icon className="h-4 w-4" />
                    {item.title}
                  </Link>
                </Button>
              ))}
            </div>
          </div>
        </nav>

        {/* Contenu principal */}
        <main className="container mx-auto px-4 py-8">
          {children}
        </main>
      </div>
    </PermissionGuard>
  );
}