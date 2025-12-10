"use client"

import { useCart } from "@/contexts/CartContext"
import { usePermissions } from "@/hooks/usePermissions"
import { cn } from "@/lib/utils"
import { History, Home, ShoppingBag, User, UtensilsCrossed } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function BottomNav() {
  const pathname = usePathname()
  const { panier } = useCart()
  const { isAuthenticated } = usePermissions()

  const totalItems = panier.reduce((acc, item) => acc + item.quantite, 0)

  const links = [
    {
      href: "/",
      label: "Accueil",
      icon: Home,
    },
    {
      href: "/commander",
      label: "Menu",
      icon: UtensilsCrossed,
    },
    {
      href: "/panier",
      label: "Panier",
      icon: ShoppingBag,
      badge: totalItems > 0 ? totalItems : null,
    },
    {
      href: isAuthenticated ? "/historique" : "/auth/login",
      label: isAuthenticated ? "Suivi" : "Connexion",
      icon: isAuthenticated ? History : User,
    },
    {
      href: "/profil",
      label: "Profil",
      icon: User,
    },
  ]

  // Hide on desktop
  return (
    <nav className="pb-safe fixed bottom-0 left-0 z-50 w-full border-t border-gray-200 bg-white/95 backdrop-blur-md lg:hidden">
      <div className="grid h-16 grid-cols-5 items-center justify-items-center">
        {links.map((link) => {
          const isActive = pathname === link.href
          const Icon = link.icon

          return (
            <Link
              key={link.label}
              href={link.href as any}
              className={cn(
                "relative flex h-full w-full flex-col items-center justify-center gap-1 text-xs font-medium transition-colors",
                isActive ? "text-thai-orange" : "text-gray-500 hover:text-gray-900"
              )}
            >
              <div className="relative">
                <Icon className={cn("h-5 w-5", isActive && "fill-current")} />
                {link.badge ? (
                  <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                    {link.badge > 9 ? "9+" : link.badge}
                  </span>
                ) : null}
              </div>
              <span>{link.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
