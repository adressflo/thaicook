"use client"

import { usePermissions } from "@/hooks/usePermissions"
import { cn } from "@/lib/utils"
import { History, Home, MapPin, ShoppingCart, User } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function MobileNav() {
  const pathname = usePathname()
  const { isAuthenticated, clientProfile } = usePermissions()
  const currentUserRole = clientProfile?.role

  const isActive = (path: string) => pathname === path

  // Masquer la navigation mobile sur les routes admin
  if (pathname?.startsWith("/admin")) return null

  const navigation = [
    { name: "Accueil", href: "/", icon: Home },
    { name: "Commander", href: "/commander", icon: ShoppingCart },
    ...(isAuthenticated ? [{ name: "Historique", href: "/historique", icon: History }] : []),
    { name: "Contact", href: "/nous-trouver", icon: MapPin },
    { name: "Profil", href: "/profil", icon: User },
  ]

  return (
    <div className="border-thai-orange/20 pb-safe fixed bottom-0 left-0 z-50 w-full border-t bg-white/95 backdrop-blur-md md:hidden">
      <nav className="flex h-16 items-center justify-around px-2">
        {navigation.map((item) => {
          const active = isActive(item.href)
          return (
            <Link
              key={item.name}
              href={item.href as any}
              onClick={() => haptic.light()}
              className={cn(
                "flex flex-col items-center justify-center space-y-1 rounded-lg px-3 py-1 transition-all duration-200",
                active
                  ? "text-thai-orange"
                  : "text-thai-green/70 hover:text-thai-green hover:bg-thai-green/5"
              )}
            >
              <item.icon
                className={cn(
                  "h-6 w-6 transition-transform duration-200",
                  active ? "scale-110 stroke-[2.5px]" : "stroke-current"
                )}
              />
              <span className={cn("text-[10px] font-medium", active ? "font-bold" : "")}>
                {item.name}
              </span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
