"use client"

import { Button } from "@/components/ui/button"
import { useIsMobile } from "@/hooks/use-mobile"
import { usePermissions } from "@/hooks/usePermissions"
import { cn } from "@/lib/utils"
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Command,
  CookingPot,
  History,
  MapPin,
  Settings,
  Shield,
  ShoppingBasket,
  ShoppingCart,
  TrendingUp,
  User,
  Users,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Dispatch, SetStateAction, useEffect } from "react"

interface SidebarProps {
  isOpen: boolean
  setIsOpen: Dispatch<SetStateAction<boolean>>
}

export const Sidebar = ({ isOpen, setIsOpen }: SidebarProps) => {
  const isMobile = useIsMobile()
  const pathname = usePathname()
  const { isAuthenticated, isAdmin, clientProfile } = usePermissions()
  const currentUserRole = clientProfile?.role
  const currentUser = isAuthenticated ? clientProfile : null

  const logoPath = "/logo.svg"

  const handleLinkClick = () => {
    if (isMobile) {
      setIsOpen(false)
    }
  }

  useEffect(() => {
    if (isMobile === undefined) return
    setIsOpen(!isMobile)
  }, [isMobile, setIsOpen])

  const navigation = [
    { name: "Commander", href: "/commander", icon: ShoppingCart },
    currentUser && {
      name: "Suivi & historique",
      href: "/historique",
      icon: History,
    },
    { name: "Événements", href: "/evenements", icon: Calendar },
    { name: "Nous trouver", href: "/nous-trouver", icon: MapPin },
    { name: "Profil", href: "/profil", icon: User },
    { name: "À propos", href: "/a-propos", icon: Users },
  ].filter(Boolean)

  const adminMenuItems = [
    {
      name: "Centre de Commandement",
      href: "/admin/centre-commandement",
      icon: Command,
    },
    { name: "Approvisionnement", href: "/admin/courses", icon: ShoppingCart },
    { name: "Commandes", href: "/admin/commandes", icon: ShoppingBasket },
    { name: "Gestion Plats", href: "/admin/plats", icon: CookingPot },
    { name: "Clients", href: "/admin/clients", icon: Users },
    { name: "Statistiques", href: "/admin/statistiques", icon: TrendingUp },
    { name: "Paramètres", href: "/admin/parametres", icon: Settings },
  ]

  const isActive = (path: string) => pathname === path
  const isAdminActive = () => pathname?.startsWith("/admin") ?? false

  return (
    <>
      {/* Hamburger button removed - replaced by MobileNav */}

      <div
        className={cn(
          "border-thai-orange/20 group fixed top-0 left-0 z-40 h-full border-r bg-white shadow-lg transition-all duration-300",
          isMobile
            ? isOpen
              ? "w-64 translate-x-0"
              : "w-64 -translate-x-full"
            : isOpen
              ? "w-64"
              : "w-20"
        )}
      >
        {/* Header avec logo */}
        <div
          className={cn(
            "border-thai-orange/20 relative flex items-center border-b p-3",
            isMobile && isOpen ? "mt-12" : ""
          )}
          style={{ minHeight: "65px" }}
        >
          <Link
            href="/"
            className="flex w-full items-center space-x-2 overflow-hidden"
            onClick={handleLinkClick}
          >
            <img
              src={logoPath}
              alt="ChanthanaThaiCook Logo"
              className="h-10 w-10 shrink-0 rounded-full object-contain"
            />
            {isOpen && (
              <div className="flex flex-col truncate">
                <span className="text-thai-green text-base font-bold whitespace-nowrap">
                  ChanthanaThaiCook
                </span>
                <span className="text-thai-orange -mt-1 text-xs whitespace-nowrap">
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
                "border-thai-orange/20 text-thai-orange hover:bg-thai-orange absolute top-1/2 -right-3 h-6 w-6 -translate-y-1/2 rounded-full border-2 bg-white shadow-md transition-all duration-200 hover:text-white",
                isOpen ? "opacity-0 group-hover:opacity-100" : "opacity-100"
              )}
              aria-label={isOpen ? "Réduire le menu" : "Agrandir le menu"}
            >
              {isOpen ? <ChevronLeft className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
            </Button>
          )}
        </div>

        {/* Navigation */}
        <nav className="grow space-y-1 overflow-y-auto p-3">
          {navigation.map(
            (item) =>
              item && (
                <Link
                  key={item.name}
                  href={item.href as any}
                  onClick={handleLinkClick}
                  className={cn(
                    "group relative flex items-center rounded-lg px-3 py-2.5 transition-colors duration-200",
                    isActive(item.href)
                      ? "bg-thai-orange text-white shadow-md"
                      : "text-thai-green hover:bg-thai-orange/10 hover:text-thai-orange",
                    !isOpen && "justify-center"
                  )}
                >
                  <item.icon
                    className={cn(
                      "h-5 w-5 shrink-0",
                      isActive(item.href)
                        ? "text-white"
                        : "text-thai-orange group-hover:text-thai-orange"
                    )}
                  />
                  {isOpen && <span className="ml-3 text-sm font-medium">{item.name}</span>}

                  {/* Tooltip pour le mode réduit */}
                  {!isOpen && (
                    <div className="pointer-events-none absolute left-full z-50 ml-2 rounded bg-gray-900 px-2 py-1 text-xs whitespace-nowrap text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                      {item.name}
                    </div>
                  )}
                </Link>
              )
          )}

          {/* Section Admin */}
          {currentUserRole === "admin" && (
            <div className="border-thai-orange/10 mt-4 border-t pt-4">
              {/* En-tête Administration */}
              <Link
                href="/admin"
                onClick={handleLinkClick}
                className={cn(
                  "group relative mb-2 flex items-center rounded-lg px-3 py-2.5 transition-colors duration-200",
                  isAdminActive()
                    ? "bg-thai-green text-white shadow-md"
                    : "text-thai-green/80 hover:bg-thai-green/10 hover:text-thai-green",
                  !isOpen && "justify-center"
                )}
              >
                <Shield
                  className={cn(
                    "h-5 w-5 shrink-0",
                    isAdminActive()
                      ? "text-white"
                      : "text-thai-green/80 group-hover:text-thai-green"
                  )}
                />
                {isOpen && <span className="ml-3 text-sm font-medium">Administration</span>}

                {/* Tooltip pour le mode réduit */}
                {!isOpen && (
                  <div className="pointer-events-none absolute left-full z-50 ml-2 rounded bg-gray-900 px-2 py-1 text-xs whitespace-nowrap text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                    Administration
                  </div>
                )}
              </Link>

              {/* Sous-menus admin - visibles uniquement quand sidebar ouverte et sur pages admin */}
              {isOpen && isAdminActive() && (
                <div className="ml-4 space-y-1">
                  {adminMenuItems.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href as any}
                      onClick={handleLinkClick}
                      className={cn(
                        "group relative flex items-center rounded-lg px-3 py-2 text-sm transition-colors duration-200",
                        isActive(item.href)
                          ? "bg-thai-orange text-white shadow-sm"
                          : "text-thai-green/70 hover:bg-thai-orange/10 hover:text-thai-orange"
                      )}
                    >
                      <item.icon
                        className={cn(
                          "mr-3 h-4 w-4 shrink-0",
                          isActive(item.href)
                            ? "text-white"
                            : "text-thai-orange/70 group-hover:text-thai-orange"
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
            className="bg-thai-orange absolute top-0 -right-4 h-full w-8 cursor-pointer opacity-0 transition-opacity duration-200 hover:opacity-10"
            onClick={() => setIsOpen(true)}
            title="Ouvrir le menu"
          />
        )}
      </div>

      {/* Overlay pour mobile */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}
