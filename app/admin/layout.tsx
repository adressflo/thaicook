"use client"

import { PermissionGuard } from "@/components/shared/PermissionGuard"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  BarChart3,
  Beaker,
  Bot,
  ChevronLeft,
  Home,
  LayoutGrid,
  Package,
  Settings,
  ShoppingCart,
  Users,
  Utensils,
  Video,
  Zap,
} from "lucide-react"
import Link from "next/link"

import { AdminMobileNav } from "@/components/layout/AdminMobileNav"

const adminNavItems = [
  {
    title: "Centre de Commandement",
    href: "/admin",
    icon: LayoutGrid,
    description: "Vue d'ensemble et contrôle principal",
  },
  {
    title: "Commandes",
    href: "/admin/commandes",
    icon: ShoppingCart,
    description: "Gestion des commandes clients",
  },
  {
    title: "Plats & Menu",
    href: "/admin/plats",
    icon: Utensils,
    description: "Gestion du menu et des plats",
  },
  {
    title: "Clients",
    href: "/admin/clients",
    icon: Users,
    description: "Gestion de la clientèle",
  },
  {
    title: "Statistiques",
    href: "/admin/statistiques",
    icon: BarChart3,
    description: "Analyses et rapports",
  },
  {
    title: "Approvisionnement",
    href: "/admin/courses",
    icon: Package,
    description: "Gestion des stocks",
  },
  {
    title: "IA Recommandations",
    href: "/admin/recommendations-ia",
    icon: Bot,
    description: "Intelligence artificielle",
  },
  {
    title: "IA Stock",
    href: "/admin/stock-ia",
    icon: Zap,
    description: "Gestion intelligente du stock",
  },
  {
    title: "Hero Media",
    href: "/admin/hero-media",
    icon: Video,
    description: "Gestion du carousel hero",
  },
  {
    title: "Advanced",
    href: "/admin/advanced",
    icon: Settings,
    description: "Paramètres avancés",
  },
  {
    title: "Paramètres",
    href: "/admin/parametres",
    icon: Settings,
    description: "Configuration système",
  },
  {
    title: "Test Visuel",
    href: "/admin/testvisuel",
    icon: Beaker,
    description: "Validation complète des composants",
  },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <PermissionGuard requireAdmin={true}>
      <div className="from-thai-cream/30 to-thai-gold/10 min-h-screen bg-linear-to-br">
        {/* Header Admin */}
        <header className="from-thai-green to-thai-orange border-thai-orange/20 hidden border-b bg-linear-to-r text-white shadow-xl lg:block">
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
                  <p className="text-sm text-white/90">Panneau de contrôle administrateur</p>
                </div>
              </div>
              <Badge variant="secondary" className="border-white/30 bg-white/20 text-white">
                Admin Mode
              </Badge>
            </div>
          </div>
        </header>

        {/* Navigation Admin */}
        <nav className="border-thai-orange/10 sticky top-0 z-10 hidden border-b bg-white/80 backdrop-blur-sm lg:block">
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

        {/* Mobile Nav Admin */}
        <AdminMobileNav />

        {/* Contenu principal */}
        <main className="container mx-auto px-4 py-8 pb-20 lg:pb-8">{children}</main>
      </div>
    </PermissionGuard>
  )
}
